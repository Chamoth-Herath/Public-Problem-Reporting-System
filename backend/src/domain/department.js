import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: '🏛️' },
    description: { type: String, default: '' },
    hotline: { type: String, default: '' },
    email: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;