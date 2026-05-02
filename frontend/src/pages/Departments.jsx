import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './Departments.css';

const departments = [
    {
        icon: '💧',
        title: 'Water Supply',
        brief: 'Report pipe breaks, water shortages, contamination issues and supply disruptions to the National Water Supply & Drainage Board.',
        path: '/report/water',
        color: '#4a6fa5'
    },
    {
        icon: '⚡',
        title: 'Electricity',
        brief: 'Report power outages, electrical faults, transformer issues and service disruptions to the Ceylon Electricity Board.',
        path: '/report/electricity',
        color: '#4a6fa5'
    },
    {
        icon: '🗑️',
        title: 'Garbage & Sanitation',
        brief: 'Report uncollected waste, illegal dumping, blocked drains and sanitation issues to your local Municipal Council.',
        path: '/report/garbage',
        color: '#4a6fa5'
    },
    {
        icon: '🏥',
        title: 'Health',
        brief: 'Report health hazards, unsanitary conditions, disease outbreaks and public health concerns to the Ministry of Health.',
        path: '/report/health',
        color: '#4a6fa5'
    },
    {
        icon: '👮',
        title: 'Police',
        brief: 'Report crimes, suspicious activity, traffic violations and public safety concerns to the Sri Lanka Police.',
        path: '/report/police',
        color: '#5f6b7a'
    },
    {
        icon: '🚒',
        title: 'Fire & Rescue',
        brief: 'Report fire emergencies, rescue situations and fire hazards to the Sri Lanka Fire & Rescue Services.',
        path: '/report/fire',
        color: '#f97316'
    },
    {
        icon: '🌾',
        title: 'Agriculture',
        brief: 'Report crop diseases, irrigation failures, pest outbreaks and farming infrastructure issues to the Ministry of Agriculture.',
        path: '/report/agriculture',
        color: '#5f6b7a'
    },
    {
        icon: '🎓',
        title: 'Education',
        brief: 'Report school infrastructure issues, teacher shortages, facility damage and educational service problems to the Ministry of Education.',
        path: '/report/education',
        color: '#5f6b7a'
    },
    {
        icon: '🛣️',
        title: 'Roads & Highways',
        brief: 'Report road damage, potholes, broken streetlights and highway infrastructure issues to the Road Development Authority.',
        path: '/report/roads',
        color: '#5f6b7a'
    },
    {
        icon: '🌿',
        title: 'Environment',
        brief: 'Report illegal deforestation, pollution, wildlife threats and environmental damage to the Central Environmental Authority.',
        path: '/report/environment',
        color: '#4a6fa5'
    },
    {
        icon: '🚌',
        title: 'Transport',
        brief: 'Report public transport issues, bus route problems and vehicle safety concerns to the National Transport Commission.',
        path: '/report/transport',
        color: '#4a6fa5'
    },
    {
        icon: '🏛️',
        title: 'Municipal Council',
        brief: 'Report general civic issues, building violations, noise complaints and local governance problems to your Municipal Council.',
        path: '/report/municipal',
        color: '#4a6fa5'
    },
    {
        icon: '💼',
        title: 'Labour & Employment',
        brief: 'Report workplace violations, unfair dismissals, safety hazards and labour law breaches to the Department of Labour.',
        path: '/report/labour',
        color: '#4a6fa5'
    },
];

const Departments = () => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo('.dept-card',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
        );
        gsap.fromTo('.report-hero h1, .report-hero p',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
    }, []);
    useEffect(() => {
        document.title = 'Departments - Public Problem Reporting System';
    }, []);

    return (
        <div className="report-page">
            <div className="report-hero">
                <h1>Report an Issue</h1>
                <p>Select the relevant department to file your complaint</p>
            </div>

            <div className="dept-grid">
                {departments.map((dept, index) => (
                    <div
                        className="dept-card"
                        key={index}
                        style={{ '--dept-color': dept.color }}
                        onClick={() => navigate(dept.path)}
                    >
                        <div className="dept-card-inner">

                            {/* FRONT */}
                            <div className="dept-front">
                                <div className="dept-icon">{dept.icon}</div>
                                <h3>{dept.title}</h3>
                                <span className="hover-hint">Hover for details</span>
                            </div>

                            {/* BACK */}
                            <div className="dept-back">
                                <div className="dept-icon-sm">{dept.icon}</div>
                                <h3>{dept.title}</h3>
                                <p>{dept.brief}</p>
                                <span className="report-link">Report Now →</span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Departments;