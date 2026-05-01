import Complaint from '../domain/complaint.js';

export const createComplaint = async ({ clerkId, title, description, category, location, imageUrls, priorityLevel, province }) => {
    const complaint = new Complaint({
        clerkId, title, description, category, location,
        imageUrls: imageUrls || [],
        priorityLevel: priorityLevel || 'Medium',
        province: province || 'Unknown'
    });
    await complaint.save();
    return complaint;
};

export const getComplaintsByClerkId = async (clerkId) => {
    return await Complaint.find({ clerkId }).sort({ createdAt: -1 });
};

export const getComplaintsByCategory = async (category) => {
    return await Complaint.find({ category }).sort({ createdAt: -1 });
};

export const getComplaintsByClerkIdAndCategory = async (clerkId, category) => {
    return await Complaint.find({ clerkId, category }).sort({ createdAt: -1 });
};

export const getComplaintById = async (complaintId) => {
    return await Complaint.findOne({ complaintId });
};

export const updateComplaintStatus = async (complaintId, status, resolvedImageUrls) => {
    const update = { status };
    if (status === 'Resolved') {
        update.resolvedDate = new Date();
        if (resolvedImageUrls?.length > 0) {
            update.resolvedImageUrls = resolvedImageUrls;
        }
    }
    return await Complaint.findOneAndUpdate({ complaintId }, update, { new: true });
};