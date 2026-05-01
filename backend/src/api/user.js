import express from 'express';
import {
    createUser, getAllUsers, getUserById,
    getUserByEmail, updateUser, deleteUser,
    getUsersByRole, getUsersByDepartment
} from '../application/user.js';

const router = express.Router();

// POST /api/users — Create user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, department, phone } = req.body;
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: 'name, email, password and role are required' });

        const existing = await getUserByEmail(email);
        if (existing) return res.status(409).json({ message: 'Email already exists' });

        const user = await createUser({ name, email, password, role, department, phone });
        const { password: _, ...safeUser } = user.toObject();
        res.status(201).json({ message: 'User created', data: safeUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/users — Get all users
router.get('/', async (req, res) => {
    try {
        const { role, department } = req.query;
        let users;
        if (role) users = await getUsersByRole(role);
        else if (department) users = await getUsersByDepartment(department);
        else users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        delete updates._id;
        if (updates.password === '') delete updates.password;
        const user = await updateUser(req.params.id, updates);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/users/login — Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });

        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        if (user.status === 'Inactive')
            return res.status(403).json({ message: 'Account is inactive' });

        const { password: _, ...safeUser } = user.toObject();
        res.status(200).json({ message: 'Login successful', data: safeUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;