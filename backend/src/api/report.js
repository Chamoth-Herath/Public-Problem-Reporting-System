import express from 'express';
import {
    createEmergencyRequest,
    getAllEmergencyRequests,
    getEmergencyById,
    updateEmergencyStatus,
    getActiveRequestByPhone,
    getRequestByRef
} from '../application/report.js';
import Emergency from '../domain/report.js';

const router = express.Router();

// POST /api/emergency
router.post('/', async (req, res) => {
    try {
        const { serviceType, phone, location, coordinates } = req.body;
        if (!serviceType || !phone || !location)
            return res.status(400).json({ message: 'serviceType, phone and location are required' });
        const emergency = await createEmergencyRequest({ serviceType, phone, location, coordinates });
        res.status(201).json({
            message: 'Emergency request submitted successfully',
            referenceNumber: emergency.referenceNumber,
            data: emergency
        });
    } catch (error) {
        console.log('EMERGENCY ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency — all (admin)
router.get('/', async (req, res) => {
    try {
        const emergencies = await getAllEmergencyRequests();
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency/department/:dept — agent fetches their emergencies
router.get('/department/:dept', async (req, res) => {
    try {
        const dept = decodeURIComponent(req.params.dept);
        const emergencies = await Emergency.find({
            agentDepartment: dept,
            status: { $nin: ['resolved', 'cancelled'] }
        }).sort({ createdAt: -1 });
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency/phone/:phone
router.get('/phone/:phone', async (req, res) => {
    try {
        const emergency = await getActiveRequestByPhone(req.params.phone);
        if (!emergency) return res.status(404).json({ message: 'No active request found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency/ref/:ref
router.get('/ref/:ref', async (req, res) => {
    try {
        const emergency = await getRequestByRef(req.params.ref);
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency/:id
router.get('/:id', async (req, res) => {
    try {
        const emergency = await getEmergencyById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/emergency/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, agentId, agentName, notes } = req.body;
        const update = { status };
        if (agentId) update.assignedAgentId = agentId;
        if (agentName) update.assignedAgentName = agentName;
        if (notes) update.notes = notes;
        const emergency = await Emergency.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Status updated', data: emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/emergency/:id
router.delete('/:id', async (req, res) => {
    try {
        await Emergency.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;