import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['hospital', 'fire', 'police'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'on_the_way', 'arrived', 'resolved'],
        default: 'pending'
    },
    referenceNumber: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// Auto generate reference number before saving
emergencySchema.pre('save', async function() {
    if (!this.referenceNumber) {
        this.referenceNumber = `EM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    }
});

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;