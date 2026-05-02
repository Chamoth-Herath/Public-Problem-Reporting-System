import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['hospital', 'fire', 'police'],
        required: true
    },
    phone:    { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'on_the_way', 'arrived', 'resolved', 'cancelled'],
        default: 'pending'
    },
    referenceNumber: { type: String, unique: true },
    agentDepartment: { type: String, default: null }, // which dept handles it
    assignedAgentId: { type: String, default: null },
    assignedAgentName: { type: String, default: null },
    notes: { type: String, default: '' },
}, { timestamps: true });

emergencySchema.pre('save', async function() {
    if (!this.referenceNumber) {
        this.referenceNumber = `EM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    }
    // Auto-assign department based on service type
    if (!this.agentDepartment) {
        const map = { hospital: 'Health', police: 'Police', fire: 'Fire & Rescue' };
        this.agentDepartment = map[this.serviceType] || null;
    }
});

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;