import express from 'express';
import Disaster from '../domain/disaster.js';
import {
    createDisasterReport,
    getAllReports,
    assignReport,
    getAgentReports,
    resolveReport,
} from '../application/disaster.js';

const router = express.Router();

// Public — submit report
router.post('/', async (req, res) => {
    try {
        const report = await createDisasterReport(req.body);
        res.status(201).json({ success: true, refNumber: report.refNumber });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save report' });
    }
});

// Admin — fetch all reports (auto-flips Pending → In Review)
router.get('/admin/all', async (req, res) => {
    try {
        const reports = await getAllReports();
        res.json({ success: true, reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin — assign report to an agent
// PATCH /api/disaster/admin/assign/:reportId  body: { agentId }
router.patch('/admin/assign/:reportId', async (req, res) => {
    try {
        const report = await assignReport(req.params.reportId, req.body.agentId);
        res.json({ success: true, report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Agent — get my assigned reports
// GET /api/disaster/agent/:agentId
router.get('/agent/:agentId', async (req, res) => {
    try {
        const reports = await getAgentReports(req.params.agentId);
        res.json({ success: true, reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Agent — resolve a report
// PATCH /api/disaster/agent/resolve/:reportId  body: { agentId, note }
router.patch('/agent/resolve/:reportId', async (req, res) => {
    try {
        const report = await resolveReport(req.params.reportId, req.body.agentId, req.body.note);
        res.json({ success: true, report });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.patch('/:id/assign', async (req, res) => {
    try {
        const { agentId, agentName } = req.body;
        const report = await Disaster.findByIdAndUpdate(
            req.params.id,
            { status: 'Assigned', assignedTo: agentId, agentName, assignedAt: new Date() },
            { new: true }
        );
        if (!report) return res.status(404).json({ message: 'Not found' });
        res.json({ success: true, report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await Disaster.find().sort({ submittedAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;