import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './Services.css';

const ReportIcon = ({ color }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const EmergencyIcon = ({ color }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const DisasterIcon = ({ color }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M3 13 Q7 10 12 13 Q17 16 21 13" />
        <path d="M3 17 Q7 14 12 17 Q17 20 21 17" />
    </svg>
);

const Services = () => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo('.service-box',
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }
        );
        gsap.fromTo('.services-hero h1, .services-hero p',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
    }, []);

    const services = [
        {
            icon: ReportIcon,
            title: 'Public Problem Reporting',
            desc: 'Report infrastructure issues like water pipe breaks, power outages, uncollected garbage, road damage and more directly to the relevant government department. Upload photos, track your complaint status and get resolution timelines.',
            features: ['Water Supply', 'Electricity', 'Garbage', 'Roads', 'Health', 'Police', 'Agriculture', 'Education'],
            color: '#185FA5',
            path: '/departments'
        },
        {
            icon: EmergencyIcon,
            title: 'Emergency Services',
            desc: 'Request immediate emergency assistance including ambulance services from the nearest hospital, fire brigade, and police. Available 24/7 for urgent situations across all provinces in Sri Lanka.',
            features: ['Ambulance Request', 'Fire Brigade', 'Police Emergency', 'Nearest Hospital Locator'],
            color: '#e74c3c',
            path: '/emergency'
        },
        {
            icon: DisasterIcon,
            title: 'Disaster Management',
            desc: 'Report and get assistance for natural disasters including floods, landslides, droughts and other emergency situations. Mark your area as a red zone and alert the relevant disaster management authorities.',
            features: ['Flood Reporting', 'Landslide Alerts', 'Red Zone Marking', 'Evacuation Assistance'],
            color: '#1D9E75',
            path: '/disaster'
        },
    ];

    return (
        <div className="services-page">
            <div className="services-hero">
                <h1>Our Services</h1>
                <p>Everything you need to report, respond, and recover — all in one place</p>
            </div>

            <div className="services-boxes">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div
                            className="service-box"
                            key={index}
                            style={{ '--box-color': service.color }}
                            onClick={() => navigate(service.path)}
                        >
                            <div className="box-icon">
                                <div className="icon-wrap" style={{ background: service.color + '18' }}>
                                    <Icon color={service.color} />
                                </div>
                            </div>
                            <h2>{service.title}</h2>
                            <p>{service.desc}</p>
                            <ul className="box-features">
                                {service.features.map((f, i) => (
                                    <li key={i}><span>✓</span> {f}</li>
                                ))}
                            </ul>
                            <button className="box-btn">Get Started →</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Services;