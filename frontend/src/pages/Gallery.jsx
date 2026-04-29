import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Toggle this to true once your backend is live ── */
const BACKEND_CONNECTED = false;

const PROVINCES = ['All', 'Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];

const DEPARTMENTS = [
    {
        name: 'Water Supply & Drainage',
        color: '#185FA5',
        icon: '💧',
        head: { name: 'Mr. Kasun Perera', title: 'Digital Water Systems Coordinator', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Ms. Dilani Weerakoon', title: 'Field Operations Officer', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&h=400&fit=crop' },
            { name: 'Mr. Sandun Rajapaksha', title: 'Pipeline Maintenance Lead', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&fit=crop',
    },
    {
        name: 'Ceylon Electricity Board',
        color: '#1D9E75',
        icon: '⚡',
        head: { name: 'Mr. Dinuka Silva', title: 'Smart Grid Operations Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Mr. Kavindu Senanayake', title: 'Grid Monitoring Officer', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&fit=crop' },
            { name: 'Ms. Piumi Abeysekara', title: 'Outage Response Analyst', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=900&fit=crop',
    },
    {
        name: 'Municipal Councils',
        color: '#042C53',
        icon: '🏛️',
        head: { name: 'Mr. Ramesh De Silva', title: 'Municipal E-Governance Officer', img: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Ms. Tharushi Fernando', title: 'Sanitation Monitoring Officer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop' },
            { name: 'Mr. Chamod Gunawardena', title: 'Waste Management Coordinator', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=900&fit=crop',
    },
    {
        name: 'Ministry of Health',
        color: '#185FA5',
        icon: '🏥',
        head: { name: 'Dr. Nadeesha Jayasinghe', title: 'Public Health Data Systems Manager', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Ms. Ishara Ranasinghe', title: 'Health Compliance Officer', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop' },
            { name: 'Ms. Dilani Weerakoon', title: 'Community Health Analyst', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=900&fit=crop',
    },
    {
        name: 'Sri Lanka Police',
        color: '#1D9E75',
        icon: '👮',
        head: { name: 'Mr. Lahiru Wickramasinghe', title: 'Digital Crime Reporting Coordinator', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Mr. Ramesh De Silva', title: 'Public Safety Officer', img: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?q=80&w=400&h=400&fit=crop' },
            { name: 'Mr. Sandun Rajapaksha', title: 'Community Liaison Officer', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?q=80&w=900&fit=crop',
    },
    {
        name: 'Roads & Highways',
        color: '#042C53',
        icon: '🛣️',
        head: { name: 'Mr. Sandun Rajapaksha', title: 'Infrastructure Monitoring Systems Officer', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&h=600&fit=crop' },
        officers: [
            { name: 'Mr. Kavindu Senanayake', title: 'Road Maintenance Coordinator', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&fit=crop' },
            { name: 'Mr. Chamod Gunawardena', title: 'Highway Inspection Officer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop' },
        ],
        deptImg: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=900&fit=crop',
    },
];

const DUMMY_COMPLAINTS = [
    { id: 1,  province: 'Western',       dept: 'Water Supply',  title: 'Burst pipe flooding main road',       date: '12 Apr 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&fit=crop' },
    { id: 2,  province: 'Central',       dept: 'Electricity',   title: 'Power pole collapse after storm',     date: '09 Apr 2026', status: 'In Progress', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&fit=crop' },
    { id: 3,  province: 'Southern',      dept: 'Garbage',       title: 'Uncollected waste piling on street',  date: '07 Apr 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&fit=crop' },
    { id: 4,  province: 'Northern',      dept: 'Roads',         title: 'Large pothole on highway A9',         date: '05 Apr 2026', status: 'Pending',     img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600&fit=crop' },
    { id: 5,  province: 'Eastern',       dept: 'Water Supply',  title: 'No water supply for 3 days',          date: '03 Apr 2026', status: 'In Progress', img: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600&fit=crop' },
    { id: 6,  province: 'Western',       dept: 'Health',        title: 'Dengue breeding site near school',    date: '01 Apr 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&fit=crop' },
    { id: 7,  province: 'North Western', dept: 'Electricity',   title: 'Streetlights out for entire ward',    date: '29 Mar 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&fit=crop' },
    { id: 8,  province: 'Uva',           dept: 'Agriculture',   title: 'Irrigation canal blocked by debris',  date: '27 Mar 2026', status: 'Pending',     img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&fit=crop' },
    { id: 9,  province: 'Sabaragamuwa',  dept: 'Roads',         title: 'Bridge railing collapsed',            date: '25 Mar 2026', status: 'In Progress', img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600&fit=crop' },
    { id: 10, province: 'North Central', dept: 'Water Supply',  title: 'Contaminated water in village well',  date: '23 Mar 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&fit=crop' },
    { id: 11, province: 'Central',       dept: 'Health',        title: 'Hospital waste dumped in river',      date: '20 Mar 2026', status: 'Pending',     img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&fit=crop' },
    { id: 12, province: 'Southern',      dept: 'Police',        title: 'Illegal construction blocking road',  date: '18 Mar 2026', status: 'Resolved',    img: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?q=80&w=600&fit=crop' },
];

const STATUS_COLOR = { Resolved: '#1D9E75', 'In Progress': '#185FA5', Pending: '#E8A020' };

const Gallery = () => {
    const [activeProvince, setActiveProvince] = useState('All');
    const [activeDept, setActiveDept]         = useState(null);
    const [lightbox, setLightbox]             = useState(null);
    const [complaints, setComplaints]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [backendError, setBackendError]     = useState(false);

    /* Simulate backend fetch */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (BACKEND_CONNECTED) {
                /* Replace with real fetch() call when backend is ready */
                // fetch('/api/gallery/complaints').then(...)
                setComplaints([]);
                setBackendError(false);
            } else {
                setBackendError(true);
                setComplaints(DUMMY_COMPLAINTS);
            }
            setLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        document.title = 'Gallery - Public Problem Reporting System';
    }, []);

    const filtered = complaints.filter(c =>
        activeProvince === 'All' || c.province === activeProvince
    );

    /* Scroll animations */
    useEffect(() => {
        gsap.fromTo('.gallery-hero-content h1, .gallery-hero-content p',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
        gsap.fromTo('.dept-gallery-card',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: '.dept-gallery-grid', start: 'top 85%', once: true } }
        );
        gsap.fromTo('.province-filter-bar',
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: '.province-filter-bar', start: 'top 90%', once: true } }
        );
        gsap.fromTo('.complaint-card',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out',
                scrollTrigger: { trigger: '.complaints-grid', start: 'top 85%', once: true } }
        );
        gsap.fromTo('.highlight-item',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: '.highlights-grid', start: 'top 85%', once: true } }
        );
        const t = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => { clearTimeout(t); ScrollTrigger.getAll().forEach(s => s.kill()); };
    }, []);

    /* Re-animate complaint cards when filter changes */
    useEffect(() => {
        gsap.fromTo('.complaint-card',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' }
        );
    }, [activeProvince]);

    return (
        <div className="gallery-page">

            {/* ── HERO ── */}
            <section className="gallery-hero">
                <div className="gallery-hero-overlay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/WerangaR_Old_Parliament_CMB.jpeg" alt="Sri Lanka" className="gallery-hero-img" />
                <div className="gallery-hero-content">
                    <span className="g-tag">Media Gallery</span>
                    <h1>A Visual Record of<br />Public Service in Action</h1>
                    <p>Department teams, resolved complaints, and real issues reported by citizens across Sri Lanka.</p>
                </div>
            </section>



            {/* ── PROVINCE COMPLAINT GALLERY ── */}
            <section className="complaints-gallery-section">
                <div className="g-section-header">
                    <span className="g-tag">Citizen Reports</span>
                    <h2>Problems Reported Across Sri Lanka</h2>
                    <p>Real images submitted by citizens when filing complaints — filtered by province</p>
                </div>

                {/* Backend status banner */}
                {backendError && (
                    <div className="backend-notice">
                        <span className="bn-icon">🔌</span>
                        <div>
                            <strong>Demo Mode — Backend not connected</strong>
                            <p>Showing sample complaint images. Once your backend is live, set <code>BACKEND_CONNECTED = true</code> and connect your API endpoint to replace this data with real citizen submissions.</p>
                        </div>
                    </div>
                )}

                {/* Province filter */}
                <div className="province-filter-bar">
                    {PROVINCES.map(p => (
                        <button
                            key={p}
                            className={`pf-btn${activeProvince === p ? ' active' : ''}`}
                            onClick={() => setActiveProvince(p)}
                        >{p}</button>
                    ))}
                </div>

                {loading ? (
                    <div className="gallery-loading">
                        <div className="loading-spinner" />
                        <p>Loading complaint images…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="gallery-empty">
                        <span>📭</span>
                        <h3>No reports found for {activeProvince}</h3>
                        <p>No citizen complaints with images have been submitted for this province yet.</p>
                    </div>
                ) : (
                    <div className="complaints-grid">
                        {filtered.map(c => (
                            <div className="complaint-card" key={c.id} onClick={() => setLightbox(c)}>
                                <div className="cc-img-wrap">
                                    <img src={c.img} alt={c.title} />
                                    <div className="cc-overlay">
                                        <span className="cc-zoom">🔍 View</span>
                                    </div>
                                </div>
                                <div className="cc-body">
                                    <div className="cc-meta">
                                        <span className="cc-province">{c.province}</span>
                                        <span className="cc-status" style={{ color: STATUS_COLOR[c.status] }}>● {c.status}</span>
                                    </div>
                                    <h4>{c.title}</h4>
                                    <div className="cc-footer">
                                        <span className="cc-dept">{c.dept}</span>
                                        <span className="cc-date">{c.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── SRI LANKA HIGHLIGHTS ── */}
            <section className="highlights-section">
                <div className="g-section-header">
                    <span className="g-tag dark">Sri Lanka</span>
                    <h2>Our Island, Our Responsibility</h2>
                    <p>Iconic locations and infrastructure we are committed to protecting</p>
                </div>
                <div className="highlights-grid">
                    {[
                        { img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/WerangaR_Old_Parliament_CMB.jpeg', title: 'Parliament, Colombo', desc: 'Centre of Sri Lanka\'s democratic governance' },
                        { img: 'https://srilanka800.com/wp-content/uploads/2025/10/Galle-Fort-Clock-Tower.jpg', title: 'Galle Fort', desc: 'Historic southern coastal heritage site' },
                        { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/SL_Kandy_asv2020-01_img11_Arthurs_Seat_view.jpg/960px-SL_Kandy_asv2020-01_img11_Arthurs_Seat_view.jpg', title: 'Kandy City', desc: 'Cultural capital and central province hub' },
                        { img: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/7e/ca/05/ella-ella-badulla-uva.jpg', title: 'Ella, Uva Province', desc: 'Mountain communities served by our platform' },
                        { img: 'https://lh4.googleusercontent.com/proxy/T0pyUru37nquN8U9u3TqlO39c9tlBXWmHzyR5iqKzLbNmUL5Ij2ftTtgsqNq8mQsNQICf3mNxbZxkL7W2VT9Zrc7KwX7sHEI8MF53Cwoeu3sSUdwSGqk', title: 'Colombo Port', desc: 'Western Province\'s economic lifeline' },
                        { img: 'https://assets.roar.media/Life/2017/10/Cover-Image-1-Expressway-Junction--e1509004631486.jpg?w=1200', title: 'Northern Highway', desc: 'Connecting communities post-conflict' },
                    ].map((item, i) => (
                        <div className="highlight-item" key={i} onClick={() => setLightbox({ img: item.img, title: item.title, dept: item.desc, status: null, province: '', date: '' })}>
                            <img src={item.img} alt={item.title} />
                            <div className="hi-caption">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── LIGHTBOX ── */}
            {lightbox && (
                <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
                    <div className="lightbox-box" onClick={e => e.stopPropagation()}>
                        <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
                        <img src={lightbox.img} alt={lightbox.title} />
                        <div className="lb-info">
                            <h3>{lightbox.title}</h3>
                            <div className="lb-meta">
                                {lightbox.province && <span className="cc-province">{lightbox.province}</span>}
                                {lightbox.status   && <span className="cc-status" style={{ color: STATUS_COLOR[lightbox.status] }}>● {lightbox.status}</span>}
                            </div>
                            <p>{lightbox.dept}</p>
                            {lightbox.date && <span className="cc-date">{lightbox.date}</span>}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Gallery;