import Feedback from '../domain/feedback.js';

export const createFeedback = async ({ name, email, category, rating, message }) => {
    const feedback = new Feedback({ name, email, category, rating, message });
    await feedback.save();
    return feedback;
};

export const getAllFeedback = async () => {
    return await Feedback.find().sort({ createdAt: -1 });
};

export const getFeedbackById = async (id) => {
    return await Feedback.findById(id);
};

export const updateFeedbackStatus = async (id, status) => {
    return await Feedback.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteFeedback = async (id) => {
    return await Feedback.findByIdAndDelete(id);
};