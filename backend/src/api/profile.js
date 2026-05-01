import express from 'express';
import multer from 'multer';
import path from 'path';
import { createProfile, getProfileByClerkId, updateProfile } from '../application/profile.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|pdf/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPG, PNG, PDF allowed'));
    }
});

router.post('/', upload.single('govProof'), async (req, res) => {
    try {
        const { clerkId, fullName, phone, location, postalCode } = req.body;
        if (!clerkId || !fullName || !phone || !location || !postalCode)
            return res.status(400).json({ message: 'All fields are required' });
        if (!req.file)
            return res.status(400).json({ message: 'Government ID proof is required' });

        const existing = await getProfileByClerkId(clerkId);
        if (existing) return res.status(409).json({ message: 'Profile already exists' });

        const profile = await createProfile({
            clerkId, fullName, phone, location, postalCode,
            govProofUrl: `/uploads/${req.file.filename}`
        });
        res.status(201).json({ message: 'Profile created successfully', data: profile });
    } catch (error) {
        console.error('PROFILE ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:clerkId', upload.single('govProof'), async (req, res) => {
    try {
        const { fullName, phone, location, postalCode } = req.body;
        const updates = { fullName, phone, location, postalCode };
        if (req.file) updates.govProofUrl = `/uploads/${req.file.filename}`;

        const profile = await updateProfile(req.params.clerkId, updates);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json({ message: 'Profile updated', data: profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/:clerkId', async (req, res) => {
    try {
        const profile = await getProfileByClerkId(req.params.clerkId);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;