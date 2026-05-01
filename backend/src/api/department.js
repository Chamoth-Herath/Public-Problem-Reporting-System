import express from 'express';
import {
    createDepartment, getAllDepartments,
    getDepartmentById, updateDepartment, deleteDepartment
} from '../application/department.js';
import User from '../domain/user.js';
import Complaint from '../domain/complaint.js';

const router = express.Router();

// POST /api/departments
router.post('/', async (req, res) => {
    try {
        const { name, icon, description, hotline, email, status } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const dept = await createDepartment({ name, icon, description, hotline, email, status });
        res.status(201).json({ message: 'Department created', data: dept });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/departments — with agent count and complaint stats
router.get('/', async (req, res) => {
    try {
        const depts = await getAllDepartments();
        const result = await Promise.all(depts.map(async (d) => {
            const agents = await User.countDocuments({ department: d.name, role: 'agent' });
            const totalComplaints = await Complaint.countDocuments({ category: d.name });
            const resolvedComplaints = await Complaint.countDocuments({ category: d.name, status: 'Resolved' });
            return { ...d.toObject(), agentCount: agents, totalComplaints, resolvedComplaints };
        }));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/departments/:id
router.get('/:id', async (req, res) => {
    try {
        const dept = await getDepartmentById(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        const agents = await User.find({ department: dept.name, role: 'agent' }).select('-password');
        res.status(200).json({ ...dept.toObject(), agents });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/departments/:id
router.put('/:id', async (req, res) => {
    try {
        const dept = await updateDepartment(req.params.id, req.body);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json({ message: 'Department updated', data: dept });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/departments/:id
router.delete('/:id', async (req, res) => {
    try {
        const dept = await deleteDepartment(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json({ message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;