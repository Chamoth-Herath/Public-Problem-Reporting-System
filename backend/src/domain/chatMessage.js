import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    roomId:      { type: String, required: true, index: true },
    citizenId:   { type: String, required: true },
    citizenName: { type: String, required: true },
    agentId:     { type: String, default: null },
    agentName:   { type: String, default: null },
    department:  { type: String, required: true },
    senderId:    { type: String, required: true },
    senderName:  { type: String, required: true },
    senderType:  { type: String, enum: ['citizen', 'agent'], required: true },
    text:        { type: String, required: true },
    read:        { type: Boolean, default: false },
    status:      { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;