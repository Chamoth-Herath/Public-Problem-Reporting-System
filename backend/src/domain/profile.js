import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    postalCode: { type: String, required: true, trim: true },
    govProofUrl: { type: String, required: true },
    isComplete: { type: Boolean, default: true }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;