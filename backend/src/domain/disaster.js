import mongoose from 'mongoose';

const disasterSchema = new mongoose.Schema({
    refNumber:      { type: String, required: true, unique: true },
    disasterType:   { type: String, required: true },
    severity:       { type: String, required: true },
    location: {
        lat:     Number,
        lng:     Number,
        address: String,
    },
    reporterName:   { type: String, required: true },
    phone:          { type: String, required: true },
    description:    { type: String, required: true },
    affectedPeople: String,
    isRedZone:      { type: Boolean, default: false },

    // ── NEW ──
    status:         {
        type: String,
        enum: ['Pending', 'In Review', 'Assigned', 'Resolved'],
        default: 'Pending',
    },
    assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAt:     { type: Date, default: null },
    resolvedAt:     { type: Date, default: null },
    agentNote:      { type: String, default: '' },

    submittedAt:    { type: Date, default: Date.now },
});

export default mongoose.model('Disaster', disasterSchema);