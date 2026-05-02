import express from 'express';


const router = express.Router();

const DEPARTMENTS = [
    { type: 'department', title: 'Water Supply', desc: 'Report pipe breaks, water shortages, contamination issues', icon: '💧', url: '/report/water' },
    { type: 'department', title: 'Electricity', desc: 'Report power outages, electrical faults, transformer failures', icon: '⚡', url: '/report/electricity' },
    { type: 'department', title: 'Garbage & Sanitation', desc: 'Report uncollected waste, illegal dumping, blocked drains', icon: '🗑️', url: '/report/garbage' },
    { type: 'department', title: 'Health', desc: 'Report health hazards, disease outbreaks, hospital complaints', icon: '🏥', url: '/report/health' },
    { type: 'department', title: 'Police', desc: 'Report crimes, suspicious activity, traffic violations', icon: '👮', url: '/report/police' },
    { type: 'department', title: 'Agriculture', desc: 'Report crop diseases, irrigation failures, pest outbreaks', icon: '🌾', url: '/report/agriculture' },
    { type: 'department', title: 'Education', desc: 'Report school infrastructure, teacher shortages, facility issues', icon: '🎓', url: '/report/education' },
    { type: 'department', title: 'Roads & Highways', desc: 'Report potholes, broken streetlights, highway hazards', icon: '🛣️', url: '/report/roads' },
    { type: 'department', title: 'Fire & Rescue', desc: 'Report fire emergencies, rescue situations and fire hazards', icon: '🚒', url: '/report/fire' },
];

const EMERGENCY_SERVICES = [
    { type: 'emergency', title: 'Ambulance / Hospital', desc: 'Request immediate ambulance from nearest hospital. Hotline: 1990', icon: '🚑', url: '/emergency' },
    { type: 'emergency', title: 'Fire Brigade', desc: 'Report fire emergencies and request fire rescue. Hotline: 111', icon: '🚒', url: '/emergency' },
    { type: 'emergency', title: 'Police Emergency', desc: 'Request immediate police assistance. Hotline: 119', icon: '🚔', url: '/emergency' },
];

const ABOUT_SECTIONS = [
    { type: 'about', title: 'About Us', desc: 'Learn about the Public Problem Reporting System Sri Lanka', icon: 'ℹ️', url: '/about' },
    { type: 'about', title: 'How It Works', desc: 'Submit a report, department reviews, get resolution and follow up', icon: '⚙️', url: '/about' },
    { type: 'about', title: 'Our Mission', desc: 'Connecting citizens with government departments for a better Sri Lanka', icon: '🎯', url: '/about' },
    { type: 'about', title: 'Contact Us', desc: 'Get in touch with the civic portal team', icon: '📞', url: '/about' },
];

const STATIC_ITEMS = [
    { type: 'chatbot', title: 'Chat with Civic Bot', desc: 'Get instant answers about complaints, departments and services', icon: '🤖', action: 'openChat' },
    { type: 'chatbot', title: 'Live Agent Chat', desc: 'Chat with a government agent for support', icon: '👤', action: 'openChat' },
    { type: 'page', title: 'Emergency Services', desc: 'Request ambulance, fire brigade or police emergency assistance', icon: '🚨', url: '/emergency' },
    { type: 'page', title: 'Gallery', desc: 'View before and after photos of resolved complaints', icon: '🖼️', url: '/gallery' },
    { type: 'page', title: 'Track My Complaint', desc: 'Track the status of your submitted complaint', icon: '📍', url: '/profile' },
    { type: 'page', title: 'File a Complaint', desc: 'Report a public infrastructure issue to the government', icon: '📋', url: '/departments' },
    { type: 'page', title: 'Disaster Management', desc: 'Report and track natural disaster situations', icon: '🌊', url: '/emergency' },
];

router.get('/', async (req, res) => {
    try {
        const q = (req.query.q || '').trim().toLowerCase();
        if (!q || q.length < 2) return res.json([]);

        const results = [];

        // Search static items (departments, emergency, about, pages)
        const allStatic = [...DEPARTMENTS, ...EMERGENCY_SERVICES, ...ABOUT_SECTIONS, ...STATIC_ITEMS];
        allStatic.forEach(item => {
            if (
                item.title.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q)
            ) {
                results.push(item);
            }
        });



        res.json(results.slice(0, 8));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;