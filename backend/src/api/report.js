import express from 'express';
import {
    createEmergencyRequest,
    getAllEmergencyRequests,
    getEmergencyById,
    updateEmergencyStatus,
    getActiveRequestByPhone,
    getRequestByRef
} from '../application/report.js';

const router = express.Router();

// POST /api/emergency — Create new emergency request
router.post('/', async (req, res) => {
    try {
        const { serviceType, phone, location, coordinates } = req.body;

        if (!serviceType || !phone || !location) {
            return res.status(400).json({ message: 'serviceType, phone and location are required' });
        }

        const emergency = await createEmergencyRequest({ serviceType, phone, location, coordinates });

        res.status(201).json({
            message: 'Emergency request submitted successfully',
            referenceNumber: emergency.referenceNumber,
            data: emergency
        });
    } catch (error) {
        console.log('EMERGENCY ERROR:', error);  // ADD THIS LINE
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency — Get all emergency requests (for agent dashboard later)
router.get('/', async (req, res) => {
    try {
        const emergencies = await getAllEmergencyRequests();
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/emergency/:id — Get single emergency
router.get('/phone/:phone', async (req, res) => {
    try {
        const emergency = await getActiveRequestByPhone(req.params.phone);
        if (!emergency) return res.status(404).json({ message: 'No active request found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/ref/:ref', async (req, res) => {
    try {
        const emergency = await getRequestByRef(req.params.ref);
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const emergency = await getEmergencyById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/emergency/:id/status — Update status (for agent dashboard later)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const emergency = await updateEmergencyStatus(req.params.id, status);
        if (!emergency) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Status updated', data: emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;