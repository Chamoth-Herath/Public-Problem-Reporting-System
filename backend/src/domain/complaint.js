import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        unique: true
    },
    clerkId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    location: {
        type: String,
        required: true
    },
    imageUrls: [{
        type: String
    }],
    resolvedImageUrls: [{
        type: String
    }],
    priorityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    assignedAgentId: { type: String, default: null },
    assignedAgentName: { type: String, default: null },
    adminNote: { type: String, default: '' },
    agentResponse: { type: String, default: '' },
    resolutionNote: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    resolvedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

complaintSchema.pre('save', async function () {
    if (!this.complaintId) {
        this.complaintId = `CMP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    }
    if (this.status === 'Resolved' && !this.resolvedDate) {
        this.resolvedDate = new Date();
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;