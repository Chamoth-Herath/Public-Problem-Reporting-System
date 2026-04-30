import express from 'express';
import {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
    deleteFeedback
} from '../application/feedback.js';

const router = express.Router();

// POST /api/feedback — Submit feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, category, rating, message } = req.body;

        if (!name || !email || !category || !rating || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const feedback = await createFeedback({ name, email, category, rating, message });

        res.status(201).json({
            message: 'Feedback submitted successfully',
            data: feedback
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/feedback — Get all feedback (for admin dashboard later)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await getAllFeedback();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/feedback/:id — Get single feedback
router.get('/:id', async (req, res) => {
    try {
        const feedback = await getFeedbackById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/feedback/:id/status — Update status (for admin later)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await updateFeedbackStatus(req.params.id, status);
        if (!feedback) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Status updated', data: feedback });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/feedback/:id — Delete feedback (for admin later)
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await deleteFeedback(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;