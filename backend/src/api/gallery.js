import express from 'express';
import Complaint from '../domain/complaint.js';

const router = express.Router();

// GET /api/gallery
router.get('/', async (req, res) => {
    try {
        const { province } = req.query;

        const query = {
            imageUrls: { $exists: true, $not: { $size: 0 } }
        };

        if (province && province !== 'All') {
            query.province = province;
        }

        const complaints = await Complaint.find(query)
            .select('complaintId title category province location imageUrls resolvedImageUrls status resolvedDate priorityLevel createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/gallery/provinces
router.get('/provinces', async (req, res) => {
    try {
        const provinces = await Complaint.distinct('province', {
            imageUrls: { $exists: true, $not: { $size: 0 } }
        });
        res.status(200).json(provinces.filter(Boolean));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;