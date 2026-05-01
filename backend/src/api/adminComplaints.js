import express from 'express';
import Complaint from '../domain/complaint.js';
import User from '../domain/user.js';

const router = express.Router();

// GET /api/admin/complaints — all complaints with filters
router.get('/', async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priorityLevel = priority;
        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/admin/complaints/:complaintId/assign — Admin assigns to agent
router.patch('/:complaintId/assign', async (req, res) => {
    try {
        const { agentId, agentName, adminNote } = req.body;
        if (!agentId) return res.status(400).json({ message: 'agentId is required' });

        const complaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.complaintId },
            {
                status: 'In Progress',
                assignedAgentId: agentId,
                assignedAgentName: agentName,
                adminNote: adminNote || ''
            },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json({ message: 'Complaint assigned to agent', data: complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/admin/complaints/:complaintId/reject
router.patch('/:complaintId/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const complaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.complaintId },
            { status: 'Rejected', adminNote: reason || '' },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json({ message: 'Complaint rejected', data: complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const total = await Complaint.countDocuments();
        const pending = await Complaint.countDocuments({ status: 'Pending' });
        const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
        const resolved = await Complaint.countDocuments({ status: 'Resolved' });
        const rejected = await Complaint.countDocuments({ status: 'Rejected' });
        const totalUsers = await User.countDocuments();
        const agents = await User.countDocuments({ role: 'agent' });

        res.status(200).json({
            complaints: { total, pending, inProgress, resolved, rejected },
            users: { total: totalUsers, agents }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;