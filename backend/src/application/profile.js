import Profile from '../domain/profile.js';

export const createProfile = async ({ clerkId, fullName, phone, location, postalCode, govProofUrl }) => {
    const profile = new Profile({ clerkId, fullName, phone, location, postalCode, govProofUrl });
    await profile.save();
    return profile;
};

export const getProfileByClerkId = async (clerkId) => {
    return await Profile.findOne({ clerkId });
};

export const updateProfile = async (clerkId, updates) => {
    return await Profile.findOneAndUpdate({ clerkId }, updates, { new: true });
};