import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createComplaint,
    getComplaintsByClerkId,
    getComplaintsByClerkIdAndCategory,
    getComplaintById,
    updateComplaintStatus
} from '../application/complaint.js';
import Complaint from '../domain/complaint.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `complaint-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'));
        }
    }
});

const extractProvince = (location) => {
    if (!location) return 'Unknown';
    const loc = location.toLowerCase();

    if (loc.includes('western province') || loc.includes('colombo') || loc.includes('gampaha') || loc.includes('kalutara')) return 'Western';
    if (loc.includes('central province') || loc.includes('kandy') || loc.includes('matale') || loc.includes('nuwara eliya')) return 'Central';
    if (loc.includes('southern province') || loc.includes('galle') || loc.includes('matara') || loc.includes('hambantota')) return 'Southern';
    if (loc.includes('northern province') || loc.includes('jaffna') || loc.includes('kilinochchi') || loc.includes('mannar') || loc.includes('vavuniya') || loc.includes('mullaitivu')) return 'Northern';
    if (loc.includes('eastern province') || loc.includes('trincomalee') || loc.includes('batticaloa') || loc.includes('ampara')) return 'Eastern';
    if (loc.includes('north western province') || loc.includes('kurunegala') || loc.includes('puttalam')) return 'North Western';
    if (loc.includes('north central province') || loc.includes('anuradhapura') || loc.includes('polonnaruwa')) return 'North Central';
    if (loc.includes('uva province') || loc.includes('badulla') || loc.includes('monaragala')) return 'Uva';
    if (loc.includes('sabaragamuwa province') || loc.includes('ratnapura') || loc.includes('kegalle')) return 'Sabaragamuwa';

    return 'Unknown';
};
// GET /api/complaints/fix-provinces — run once to fix existing data
router.get('/fix-provinces', async (req, res) => {
    try {
        const complaints = await Complaint.find({ province: 'Unknown' });
        let fixed = 0;
        for (const c of complaints) {
            const province = extractProvince(c.location);
            if (province !== 'Unknown') {
                await Complaint.updateOne({ _id: c._id }, { province });
                fixed++;
            }
        }
        res.json({ message: `Fixed ${fixed} complaints` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/complaints
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { clerkId, title, description, category, location, priorityLevel } = req.body;
        if (!clerkId || !title || !description || !category || !location)
            return res.status(400).json({ message: 'All fields are required' });

        const imageUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const province = extractProvince(location);

        const complaint = await createComplaint({
            clerkId, title, description, category, location,
            imageUrls, priorityLevel, province
        });

        res.status(201).json({
            message: 'Complaint filed successfully',
            complaintId: complaint.complaintId,
            data: complaint
        });
    } catch (error) {
        console.error('COMPLAINT ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/complaints/user/:clerkId
router.get('/user/:clerkId', async (req, res) => {
    try {
        const complaints = await getComplaintsByClerkId(req.params.clerkId);
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/complaints/user/:clerkId/category/:category
router.get('/user/:clerkId/category/:category', async (req, res) => {
    try {
        const complaints = await getComplaintsByClerkIdAndCategory(
            req.params.clerkId,
            decodeURIComponent(req.params.category)
        );
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/complaints/:complaintId
router.get('/:complaintId', async (req, res) => {
    try {
        const complaint = await getComplaintById(req.params.complaintId);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/complaints/:complaintId/status
router.patch('/:complaintId/status', upload.array('resolvedImages', 5), async (req, res) => {
    try {
        const { status } = req.body;
        const resolvedImageUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const update = { status };
        if (status === 'Resolved') {
            update.resolvedDate = new Date();
            if (resolvedImageUrls.length > 0) update.resolvedImageUrls = resolvedImageUrls;
        }

        const complaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.complaintId },
            update,
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json({ message: 'Status updated', data: complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

});
// PATCH /api/complaints/:complaintId/respond
router.patch('/:complaintId/respond', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const complaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.complaintId },
            { agentResponse: message },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json({ message: 'Response sent', data: complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;