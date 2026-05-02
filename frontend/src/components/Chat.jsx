import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { sendMessageToBot } from "../services/chatApi";
import { useUser } from '@clerk/clerk-react';
import socket from '../services/socket';

const Chat = ({ onClose }) => {
    const { user, isSignedIn } = useUser();
    const [mode, setMode]               = useState('select');
    const [botMessages, setBotMessages] = useState([
        { id: 1, from: 'bot', text: "Hello! I'm the Civic Portal Assistant. How can I help you today?", time: new Date() }
    ]);
    const [liveMessages, setLiveMessages] = useState([]);
    const [input, setInput]             = useState('');
    const [isTyping, setIsTyping]       = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [roomId, setRoomId]           = useState(null);
    const [chatStatus, setChatStatus]   = useState('idle');
    const [onlineAgents, setOnlineAgents] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [availableDepts, setAvailableDepts] = useState([]);
    const messagesEndRef = useRef(null);

    // Fetch departments that have active agents
    useEffect(() => {
        const fetchAgentDepts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/users?role=agent');
                if (res.ok) {
                    const agents = await res.json();
                    const depts = [...new Set(
                        agents
                            .filter(a => a.status === 'Active' && a.department)
                            .map(a => a.department)
                    )];
                    const icons = {
                        'Water Supply': '💧',
                        'Electricity': '⚡',
                        'Garbage & Sanitation': '🗑️',
                        'Health': '🏥',
                        'Police': '👮',
                        'Roads & Highways': '🛣️',
                        'Agriculture': '🌾',
                        'Disaster Management': '🚨',
                        'Education': '🎓',
                    };
                    setAvailableDepts(depts.map(d => ({
                        id: d, label: d, icon: icons[d] || '🏛️'
                    })));
                }
            } catch (e) { console.error(e); }
        };
        fetchAgentDepts();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [botMessages, liveMessages, isTyping]);

    useEffect(() => {
        if (!isSignedIn || !user) return;

        socket.connect();
        socket.emit('citizen:online', { clerkId: user.id });
        socket.emit('agents:get');

        socket.on('agents:list',    (agents) => setOnlineAgents(agents));
        socket.on('agents:updated', (agents) => setOnlineAgents(agents));

        socket.on('chat:started', ({ roomId: rid }) => {
            setRoomId(rid);
            setChatStatus('waiting');
        });

        socket.on('chat:accepted', ({ agentName }) => {
            setChatStatus('connected');
            setLiveMessages(prev => [...prev, {
                id: 'sys-accepted', from: 'system',
                text: `✅ ${agentName} has joined the chat.`,
                time: new Date()
            }]);
        });

        socket.on('chat:history', ({ messages: msgs }) => {
            setLiveMessages(msgs.map(m => ({
                id: m.id,
                from: m.senderType === 'citizen' ? 'user' : 'agent',
                text: m.text, time: m.time
            })));
        });

        socket.on('chat:message', ({ message }) => {
            if (message.senderType !== 'citizen') {
                setLiveMessages(prev => [...prev, {
                    id: message.id, from: 'agent',
                    text: message.text, time: message.time
                }]);
                setUnreadCount(prev => prev + 1);
            }
        });

        socket.on('chat:agent_joined', ({ agentName }) => {
            setLiveMessages(prev => [...prev, {
                id: Date.now(), from: 'system',
                text: `👤 ${agentName} is now assisting you.`,
                time: new Date()
            }]);
        });

        socket.on('chat:restore', async ({ roomId: rid, department }) => {
            setRoomId(rid);
            setChatStatus('waiting');
            const icons = {
                'Water Supply':'💧','Electricity':'⚡','Garbage & Sanitation':'🗑️',
                'Health':'🏥','Police':'👮','Roads & Highways':'🛣️',
                'Agriculture':'🌾','Disaster Management':'🚨','Education':'🎓',
            };
            setSelectedDept({ id: department, label: department, icon: icons[department] || '🏛️' });
            setMode('agent');
            try {
                const res = await fetch(`http://localhost:5000/api/messages/room/${rid}`);
                if (res.ok) {
                    const msgs = await res.json();
                    if (msgs.length > 0) {
                        setLiveMessages(msgs.map(m => ({
                            id: m._id,
                            from: m.senderType === 'citizen' ? 'user' : 'agent',
                            text: m.text, time: m.createdAt
                        })));
                    }
                }
            } catch (e) { console.error(e); }
        });

        return () => {
            socket.off('agents:list');
            socket.off('agents:updated');
            socket.off('chat:started');
            socket.off('chat:accepted');
            socket.off('chat:history');
            socket.off('chat:message');
            socket.off('chat:agent_joined');
            socket.off('chat:restore');
            socket.disconnect();
        };
    }, [isSignedIn, user]);

    const sendBotMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { id: crypto.randomUUID(), from: 'user', text: input, time: new Date() };
        setBotMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const data = await sendMessageToBot(input);
            setBotMessages(prev => [...prev, {
                id: crypto.randomUUID(), from: 'bot', text: data.text, time: new Date()
            }]);
        } catch {
            setBotMessages(prev => [...prev, {
                id: crypto.randomUUID(), from: 'bot', text: "⚠️ Server error. Try again.", time: new Date()
            }]);
        } finally { setIsTyping(false); }
    };

    const startLiveChat = (dept) => {
        if (!isSignedIn) return;
        setSelectedDept(dept);
        setMode('agent');
        setLiveMessages([{
            id: 'sys-start', from: 'system',
            text: `💬 Connected to ${dept.label} support. Send your message — an agent will reply when available.`,
            time: new Date()
        }]);
    };

    const sendLiveMessage = () => {
        if (!input.trim() || !isSignedIn) return;
        const text = input.trim();
        setInput('');

        setLiveMessages(prev => [...prev, {
            id: Date.now(), from: 'user', text, time: new Date()
        }]);

        if (!roomId) {
            setChatStatus('waiting');
            socket.emit('chat:start', {
                citizenId: user.id,
                citizenName: user.fullName || user.firstName,
                department: selectedDept.id
            });
            socket.once('chat:started', ({ roomId: rid }) => {
                setRoomId(rid);
                socket.emit('chat:message', {
                    roomId: rid,
                    senderId: user.id,
                    senderName: user.fullName || user.firstName,
                    text,
                    senderType: 'citizen'
                });
            });
        } else {
            socket.emit('chat:message', {
                roomId,
                senderId: user.id,
                senderName: user.fullName || user.firstName,
                text,
                senderType: 'citizen'
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            mode === 'bot' ? sendBotMessage() : sendLiveMessage();
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'agent') setUnreadCount(0);
    };

    const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messages = mode === 'bot' ? botMessages : liveMessages;
    const agentsForDept = (deptId) => onlineAgents.filter(a => a.department === deptId);

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="chat-header-left">
                    <div className={`chat-avatar ${mode === 'bot' ? 'bot' : 'agent'}`}>
                        {mode === 'bot' ? '🤖' : selectedDept?.icon || '👤'}
                    </div>
                    <div>
                        <h3>
                            {mode === 'bot'    ? 'Civic Chatbot'
                                : mode === 'agent' ? `${selectedDept?.label} Support`
                                    : 'Chat Support'}
                        </h3>
                        <span className={`chat-status ${mode !== 'select' ? 'online' : ''}`}>
                            {mode === 'bot'              ? '● Online'
                                : chatStatus === 'connected' ? '● Agent Connected'
                                    : chatStatus === 'waiting'   ? '● Waiting for agent…'
                                        : '● Select department'}
                        </span>
                    </div>
                </div>
                <div className="chat-header-right">
                    {mode !== 'select' && (
                        <button className="chat-switch-btn" onClick={() => setMode('select')}>Switch</button>
                    )}
                    <button className="chat-close-btn" onClick={onClose}>✕</button>
                </div>
            </div>

            {mode !== 'select' && (
                <div className="chat-tabs">
                    <button className={`chat-tab ${mode === 'bot' ? 'active' : ''}`} onClick={() => handleModeChange('bot')}>
                        🤖 Chatbot
                    </button>
                    <button className={`chat-tab ${mode === 'agent' ? 'active' : ''}`} onClick={() => handleModeChange('agent')} style={{position:'relative'}}>
                        👤 Live Agent
                        {unreadCount > 0 && (
                            <span style={{position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#6366f1)',boxShadow:'0 0 6px rgba(99,102,241,0.8)'}}/>
                        )}
                    </button>
                </div>
            )}

            {mode === 'select' && (
                <div className="chat-select">
                    <div className="chat-select-option" onClick={() => setMode('bot')}>
                        <div className="chat-option-icon bot">🤖</div>
                        <div>
                            <h4>Civic Chatbot</h4>
                            <p>Get instant answers about complaints, departments, and services</p>
                        </div>
                        <span>→</span>
                    </div>

                    {!isSignedIn && (
                        <div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:8,padding:'10px 14px',margin:'12px 0',fontSize:'0.82rem',color:'#fbbf24'}}>
                            ⚠️ Please sign in to chat with a live agent.
                        </div>
                    )}

                    <div className="chat-select-divider">Live Agent — Select Department</div>

                    <div className="chat-dept-list">
                        {availableDepts.length === 0 ? (
                            <p style={{textAlign:'center',color:'#4a5568',fontSize:12,padding:16}}>Loading departments…</p>
                        ) : availableDepts.map(dept => {
                            const online = agentsForDept(dept.id).length;
                            return (
                                <button
                                    key={dept.id}
                                    className="chat-dept-btn"
                                    onClick={() => isSignedIn ? startLiveChat(dept) : null}
                                    style={{opacity: isSignedIn ? 1 : 0.5, cursor: isSignedIn ? 'pointer' : 'not-allowed'}}
                                >
                                    <span>{dept.icon}</span>
                                    {dept.label}
                                    {online > 0 ? (
                                        <span style={{marginLeft:'auto',fontSize:'0.7rem',background:'rgba(16,185,129,0.15)',color:'#34d399',border:'1px solid rgba(16,185,129,0.3)',borderRadius:50,padding:'2px 8px'}}>
                                            {online} online
                                        </span>
                                    ) : (
                                        <span style={{marginLeft:'auto',fontSize:'0.7rem',color:'#4a5568'}}>Leave message</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {mode !== 'select' && (
                <>
                    <div className="chat-messages">
                        {messages.map(msg => (
                            msg.from === 'system' ? (
                                <div key={msg.id} style={{textAlign:'center',padding:'6px 0'}}>
                                    <span style={{fontSize:'0.75rem',color:'#4a5568',background:'rgba(255,255,255,0.04)',padding:'4px 12px',borderRadius:50}}>{msg.text}</span>
                                </div>
                            ) : (
                                <div key={msg.id} className={`chat-msg ${msg.from === 'user' ? 'user' : 'other'}`}>
                                    {msg.from !== 'user' && (
                                        <div className="msg-avatar">{mode === 'bot' ? '🤖' : selectedDept?.icon || '👤'}</div>
                                    )}
                                    <div className="msg-bubble-wrap">
                                        <div className={`msg-bubble ${msg.from === 'user' ? 'user' : 'other'}`}>{msg.text}</div>
                                        <span className="msg-time">{formatTime(msg.time)}</span>
                                    </div>
                                </div>
                            )
                        ))}
                        {isTyping && mode === 'bot' && (
                            <div className="chat-msg other">
                                <div className="msg-avatar">🤖</div>
                                <div className="msg-bubble other typing"><span/><span/><span/></div>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>

                    <div className="chat-input-area">
                        <textarea
                            className="chat-input"
                            placeholder={mode === 'bot' ? 'Ask about services, complaints...' : 'Type your message...'}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={mode === 'bot' ? sendBotMessage : sendLiveMessage}
                            disabled={!input.trim()}
                        >➤</button>
                    </div>

                    <p className="chat-disclaimer">
                        {mode === 'bot'
                            ? 'AI assistant — for emergencies call 119'
                            : chatStatus === 'connected'
                                ? 'Connected to government agent'
                                : 'Message saved — agent will reply when available'}
                    </p>
                </>
            )}
        </div>
    );
};

export default Chat;