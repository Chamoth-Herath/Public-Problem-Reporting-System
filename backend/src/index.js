import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import complaintRouter from './api/complaint.js';
import profileRouter from './api/profile.js';
import reportRouter from './api/report.js';
import feedbackRouter from './api/feedback.js';
import userRouter from './api/user.js';
import departmentRouter from './api/department.js';
import adminComplaintRouter from './api/adminComplaints.js';
import galleryRouter from './api/gallery.js';
import chatRouter from './api/chat.js';
import setupRouter from './api/setup.js';
import ChatMessage from './domain/chatMessage.js';
import chatMessagesRouter from './api/chatMessages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.use('/api/complaints', complaintRouter);
app.use('/api/profile', profileRouter);
app.use('/api/emergency', reportRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/users', userRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/admin/complaints', adminComplaintRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/chat', chatRouter);
app.use('/api/setup', setupRouter);
app.use('/api/messages', chatMessagesRouter);

// ── In-memory chat store ──
const chatRooms = {};
const onlineAgents = {};
const onlineCitizens = {};

function getOnlineAgents() {
  return Object.entries(onlineAgents).map(([clerkId, data]) => ({
    clerkId, name: data.name, department: data.department
  }));
}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('agent:online', ({ clerkId, name, department }) => {
    onlineAgents[clerkId] = { socketId: socket.id, name, department };
    socket.join(`agent:${department}`);
    io.emit('agents:updated', getOnlineAgents());
  });

  socket.on('citizen:online', ({ clerkId }) => {
    onlineCitizens[clerkId] = socket.id;
    const myRooms = Object.values(chatRooms).filter(r => r.citizenId === clerkId);
    myRooms.forEach(room => {
      socket.join(room.roomId);
      socket.emit('chat:restore', {
        roomId: room.roomId,
        department: room.department,
        messages: room.messages
      });
    });
  });

  socket.on('agents:get', () => {
    socket.emit('agents:list', getOnlineAgents());
  });

  socket.on('chat:start', ({ citizenId, citizenName, department }) => {
    const roomId = `room:${citizenId}:${department}:${Date.now()}`;
    chatRooms[roomId] = {
      roomId, messages: [], citizenId, citizenName,
      department, agentId: null, createdAt: new Date()
    };
    socket.join(roomId);
    io.to(`agent:${department}`).emit('chat:new_request', {
      roomId, citizenId, citizenName, department, time: new Date()
    });
    socket.emit('chat:started', { roomId });
    console.log('💬 Chat started:', citizenName, department);
  });

  socket.on('chat:accept', async ({ roomId, agentId, agentName }) => {
    const room = chatRooms[roomId];
    if (!room) return;
    room.agentId = agentId;
    room.agentName = agentName;
    socket.join(roomId);

    await ChatMessage.updateMany(
        { roomId, agentId: null },
        { agentId, agentName }
    );

    const citizenSocketId = onlineCitizens[room.citizenId];
    if (citizenSocketId) {
      io.to(citizenSocketId).emit('chat:accepted', { roomId, agentName });
    }
    socket.emit('chat:history', { roomId, messages: room.messages });
    io.to(roomId).emit('chat:agent_joined', { agentName, time: new Date() });
  });

  socket.on('chat:join', ({ roomId }) => {
    socket.join(roomId);
    const room = chatRooms[roomId];
    if (room) socket.emit('chat:history', { roomId, messages: room.messages });
  });

  socket.on('chat:message', async ({ roomId, senderId, senderName, text, senderType }) => {
    const room = chatRooms[roomId];

    try {
      await ChatMessage.create({
        roomId,
        citizenId:   room ? room.citizenId   : senderId,
        citizenName: room ? room.citizenName : senderName,
        agentId:     room ? room.agentId     : null,
        agentName:   room ? room.agentName   : null,
        department:  room ? room.department  : 'Unknown',
        senderId, senderName, senderType, text
      });
    } catch (e) {
      console.error('DB save error:', e.message);
    }

    const msg = {
      id: Date.now(), senderId, senderName,
      senderType, text, time: new Date(), read: false
    };

    if (room) room.messages.push(msg);

    io.to(roomId).emit('chat:message', { roomId, message: msg });

    if (room && !room.agentId) {
      io.to(`agent:${room.department}`).emit('chat:new_request', {
        roomId,
        citizenId:   room.citizenId,
        citizenName: room.citizenName,
        department:  room.department,
        time:        new Date()
      });
    }

    console.log('📨 Message saved:', senderName, text);
  });

  socket.on('disconnect', () => {
    for (const [id, data] of Object.entries(onlineAgents)) {
      if (data.socketId === socket.id) {
        delete onlineAgents[id];
        io.emit('agents:updated', getOnlineAgents());
        break;
      }
    }
    for (const [id, sid] of Object.entries(onlineCitizens)) {
      if (sid === socket.id) { delete onlineCitizens[id]; break; }
    }
  });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
      httpServer.listen(5000, () => console.log('Server running on port 5000'));
    })
    .catch(err => console.error('MongoDB error:', err));