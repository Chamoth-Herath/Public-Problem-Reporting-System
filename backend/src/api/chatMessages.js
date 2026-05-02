import express from 'express';
import ChatMessage from '../domain/chatMessage.js';

const router = express.Router();

// GET /api/messages/:department — agent gets all rooms for their department
router.get('/department/:department', async (req, res) => {
    try {
        const dept = decodeURIComponent(req.params.department);
        // Get unique rooms
        const rooms = await ChatMessage.aggregate([
            { $match: { department: dept } },
            { $sort: { createdAt: -1 } },
            { $group: {
                    _id: '$roomId',
                    roomId:      { $first: '$roomId' },
                    citizenId:   { $first: '$citizenId' },
                    citizenName: { $first: '$citizenName' },
                    department:  { $first: '$department' },
                    agentId:     { $first: '$agentId' },
                    agentName:   { $first: '$agentName' },
                    lastMessage: { $first: '$text' },
                    lastTime:    { $first: '$createdAt' },
                    status:      { $first: '$status' },
                    unread:      { $sum: { $cond: [{ $and: [{ $eq: ['$senderType', 'citizen'] }, { $eq: ['$read', false] }] }, 1, 0] } }
                }},
            { $sort: { lastTime: -1 } }
        ]);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/messages/room/:roomId — get all messages in a room
router.get('/room/:roomId', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/messages/citizen/:citizenId — citizen gets their rooms
router.get('/citizen/:citizenId', async (req, res) => {
    try {
        const rooms = await ChatMessage.aggregate([
            { $match: { citizenId: req.params.citizenId } },
            { $sort: { createdAt: -1 } },
            { $group: {
                    _id: '$roomId',
                    roomId:      { $first: '$roomId' },
                    citizenId:   { $first: '$citizenId' },
                    citizenName: { $first: '$citizenName' },
                    department:  { $first: '$department' },
                    agentId:     { $first: '$agentId' },
                    agentName:   { $first: '$agentName' },
                    lastMessage: { $first: '$text' },
                    lastTime:    { $first: '$createdAt' },
                    status:      { $first: '$status' },
                }},
            { $sort: { lastTime: -1 } }
        ]);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/messages/room/:roomId/read — mark messages as read
router.patch('/room/:roomId/read', async (req, res) => {
    try {
        await ChatMessage.updateMany(
            { roomId: req.params.roomId, senderType: 'citizen', read: false },
            { read: true }
        );
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;