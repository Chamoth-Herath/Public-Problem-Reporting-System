import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { sendMessageToBot } from "../services/chatApi";

// const BOT_RESPONSES = {
//     water: "For water supply issues, please file a complaint at /report/water or call the NWSDB hotline at 1954.",
//     electricity: "For electricity issues, contact CEB at 1987 or file a complaint at /report/electricity.",
//     garbage: "For garbage collection issues, contact your Municipal Council at 1920 or report at /report/garbage.",
//     emergency: "For emergencies, please call 119 (Police), 1990 (Ambulance), or 111 (Fire). You can also use our Emergency page.",
//     complaint: "To file a complaint, go to Services > Public Problem Reporting and select your department.",
//     status: "To track your complaint status, visit the department page and click 'Track Complaint Status'.",
//     hello: "Hello! I'm the Civic Portal Assistant. I can help you with complaints, emergencies, and government services. How can I help?",
//     hi: "Hi there! How can I assist you today with our civic services?",
//     help: "I can help you with: filing complaints, emergency services, tracking complaint status, department information, and weather forecasts.",
//     default: "I'm sorry, I didn't quite understand that. Try asking about water, electricity, garbage, emergency services, or complaint status."
// };

// const getBotResponse = (message) => {
//     const msg = message.toLowerCase();
//     if (msg.includes('water') || msg.includes('pipe')) return BOT_RESPONSES.water;
//     if (msg.includes('electric') || msg.includes('power') || msg.includes('ceb')) return BOT_RESPONSES.electricity;
//     if (msg.includes('garbage') || msg.includes('waste') || msg.includes('trash')) return BOT_RESPONSES.garbage;
//     if (msg.includes('emergency') || msg.includes('ambulance') || msg.includes('fire') || msg.includes('police')) return BOT_RESPONSES.emergency;
//     if (msg.includes('complaint') || msg.includes('report') || msg.includes('file')) return BOT_RESPONSES.complaint;
//     if (msg.includes('status') || msg.includes('track')) return BOT_RESPONSES.status;
//     if (msg.includes('hello') || msg.includes('hey')) return BOT_RESPONSES.hello;
//     if (msg.includes('hi')) return BOT_RESPONSES.hi;
//     if (msg.includes('help')) return BOT_RESPONSES.help;
//     return BOT_RESPONSES.default;
// };

const AGENT_DEPARTMENTS = [
    { id: 'water', label: 'Water Supply', icon: '💧' },
    { id: 'electricity', label: 'Electricity', icon: '⚡' },
    { id: 'garbage', label: 'Garbage', icon: '🗑️' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'police', label: 'Police', icon: '👮' },
    { id: 'general', label: 'General', icon: '🏛️' },
];

const Chat = ({ onClose }) => {
    const [mode, setMode] = useState('select'); // select | bot | agent
    const [botMessages, setBotMessages] = useState([
        { id: 1, from: 'bot', text: "Hello! I'm the Civic Portal Assistant. How can I help you today?", time: new Date() }
    ]);
    const [agentMessages, setAgentMessages] = useState([
        { id: 1, from: 'agent', text: "Hello! You're connected to a government agent. Please describe your issue and we'll assist you shortly.", time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [agentConnected, setAgentConnected] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [botMessages, agentMessages, isTyping]);

    // Simulated bot response
    const sendBotMessage = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: crypto.randomUUID(),
            from: 'user',
            text: input,
            time: new Date()
        };

        setBotMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await sendMessageToBot(input);

            const botMsg = {
                id: crypto.randomUUID(),
                from: 'bot',
                text: data.text,
                time: new Date()
            };

            setBotMessages(prev => [...prev, botMsg]);

        } catch {
            setBotMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    from: 'bot',
                    text: "⚠️ Server error. Try again.",
                    time: new Date()
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const sendAgentMessage = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), from: 'user', text: input, time: new Date() };
        setAgentMessages(prev => [...prev, userMsg]);
        setInput('');

        // TODO: Connect to backend WebSocket
        // socket.emit('message', { dept: selectedDept, message: input });

        // Simulated agent reply
        setTimeout(() => {
            const replies = [
                "Thank you for the information. We're looking into this right now.",
                "I understand your concern. Can you provide more details about the location?",
                "We've logged your complaint. A field officer will be assigned shortly.",
                "Thank you for contacting us. Your reference number will be sent to you via SMS.",
            ];
            const agentMsg = {
                id: Date.now() + 1,
                from: 'agent',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date()
            };
            setAgentMessages(prev => [...prev, agentMsg]);
        }, 1500 + Math.random() * 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            mode === 'bot' ? sendBotMessage() : sendAgentMessage();
        }
    };

    const connectAgent = (dept) => {
        setSelectedDept(dept);
        setAgentConnected(true);
        setMode('agent');
        setAgentMessages([
            {
                id: 1, from: 'agent',
                text: `Hello! You're connected to the ${dept.label} Department. How can we assist you today?`,
                time: new Date()
            }
        ]);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messages = mode === 'bot' ? botMessages : agentMessages;
    const sendMessage = mode === 'bot' ? sendBotMessage : sendAgentMessage;

    return (
        <div className="chat-panel">

            {/* HEADER */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <div className={`chat-avatar ${mode === 'bot' ? 'bot' : 'agent'}`}>
                        {mode === 'bot' ? '🤖' : selectedDept?.icon || '👤'}
                    </div>
                    <div>
                        <h3>{mode === 'bot' ? 'Chat Bot' : mode === 'agent' ? `${selectedDept?.label} Agent` : 'Chat with an Agent'}</h3>
                        <span className={`chat-status ${mode !== 'select' ? 'online' : ''}`}>
              {mode === 'bot' ? '● Online' : mode === 'agent' ? '● Agent Connected' : '● Select Mode'}
            </span>
                    </div>
                </div>
                <div className="chat-header-right">
                    {mode !== 'select' && (
                        <button className="chat-switch-btn" onClick={() => setMode('select')}>
                            Switch
                        </button>
                    )}
                    <button className="chat-close-btn" onClick={onClose}>✕</button>
                </div>
            </div>

            {/* MODE TABS */}
            {mode !== 'select' && (
                <div className="chat-tabs">
                    <button
                        className={`chat-tab ${mode === 'bot' ? 'active' : ''}`}
                        onClick={() => setMode('bot')}
                    >
                        🤖 Chatbot
                    </button>
                    <button
                        className={`chat-tab ${mode === 'agent' ? 'active' : ''}`}
                        onClick={() => agentConnected ? setMode('agent') : setMode('select')}
                    >
                        👤 Live Agent
                    </button>
                </div>
            )}

            {/* SELECT MODE */}
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

                    <div className="chat-select-divider">Select which department agent</div>

                    <div className="chat-dept-list">
                        {AGENT_DEPARTMENTS.map(dept => (
                            <button
                                key={dept.id}
                                className="chat-dept-btn"
                                onClick={() => connectAgent(dept)}
                            >
                                <span>{dept.icon}</span>
                                {dept.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* MESSAGES */}
            {mode !== 'select' && (
                <>
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chat-msg ${msg.from === 'user' ? 'user' : 'other'}`}>
                                {msg.from !== 'user' && (
                                    <div className="msg-avatar">
                                        {mode === 'bot' ? '🤖' : selectedDept?.icon || '👤'}
                                    </div>
                                )}
                                <div className="msg-bubble-wrap">
                                    <div className={`msg-bubble ${msg.from === 'user' ? 'user' : 'other'}`}>
                                        {msg.text}
                                    </div>
                                    <span className="msg-time">{formatTime(msg.time)}</span>
                                </div>
                            </div>
                        ))}

                        {isTyping && mode === 'bot' && (
                            <div className="chat-msg other">
                                <div className="msg-avatar">🤖</div>
                                <div className="msg-bubble other typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
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
                            onClick={sendMessage}
                            disabled={!input.trim()}
                        >
                            ➤
                        </button>
                    </div>

                    <p className="chat-disclaimer">
                        {mode === 'bot'
                            ? 'AI assistant — for emergencies call 119'
                            : 'Connected to government agent — responses may be delayed'}
                    </p>
                </>
            )}

        </div>
    );
};

export default Chat;