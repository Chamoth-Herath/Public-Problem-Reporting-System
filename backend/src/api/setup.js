import express from 'express';
import User from '../domain/user.js';

const router = express.Router();

// POST /api/setup/sync-to-clerk — Call this once to sync all DB users to Clerk
router.post('/sync-to-clerk', async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['admin', 'agent'] } });
        const results = [];

        for (const user of users) {
            try {
                // Create user in Clerk
                const clerkRes = await fetch('https://api.clerk.com/v1/users', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email_address: [user.email],
                        password: req.body.defaultPassword || 'TempPass@123',
                        first_name: user.name.split(' ')[0],
                        last_name: user.name.split(' ').slice(1).join(' ') || '',
                        public_metadata: {
                            role: user.role,
                            department: user.department || null
                        }
                    })
                });

                const clerkData = await clerkRes.json();

                if (clerkRes.ok) {
                    results.push({ email: user.email, status: 'created', clerkId: clerkData.id });
                } else {
                    results.push({ email: user.email, status: 'failed', error: clerkData.errors?.[0]?.message });
                }
            } catch (err) {
                results.push({ email: user.email, status: 'error', error: err.message });
            }
        }

        res.json({ message: 'Sync complete', results });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/setup/create-clerk-user — Create a single user in Clerk
router.post('/create-clerk-user', async (req, res) => {
    try {
        const { email, password, name, role, department } = req.body;

        const clerkRes = await fetch('https://api.clerk.com/v1/users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: [email],
                password: password,
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '',
                public_metadata: {
                    role: role,
                    department: department || null
                }
            })
        });

        const data = await clerkRes.json();

        if (!clerkRes.ok) {
            return res.status(400).json({ message: data.errors?.[0]?.message || 'Failed to create Clerk user' });
        }

        res.json({ message: 'Clerk user created', clerkId: data.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;