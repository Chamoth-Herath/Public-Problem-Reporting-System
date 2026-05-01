import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const PROVINCES = ['All', 'Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];

const STATUS_COLOR = { Resolved: '#1D9E75', 'In Progress': '#185FA5', Pending: '#E8A020', 'Under Review': '#e6a817', Rejected: '#e63946' };

const Gallery = () => {
    const [activeProvince, setActiveProvince] = useState('All');
    const [lightbox, setLightbox]             = useState(null);
    const [complaints, setComplaints]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState(false);

    useEffect(() => {
        document.title = 'Gallery - Public Problem Reporting System';
    }, []);

    // Fetch from backend
    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true);
            try {
                const url = activeProvince === 'All'
                    ? 'http://localhost:5000/api/gallery'
                    : `http://localhost:5000/api/gallery?province=${encodeURIComponent(activeProvince)}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setComplaints(data);
                setError(false);
            } catch {
                setError(true);
                setComplaints([]);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [activeProvince]);

    // Scroll animations
    useEffect(() => {
        gsap.fromTo('.gallery-hero-content h1, .gallery-hero-content p',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
        gsap.fromTo('.province-filter-bar',
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: '.province-filter-bar', start: 'top 90%', once: true } }
        );
        const t = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => { clearTimeout(t); ScrollTrigger.getAll().forEach(s => s.kill()); };
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo('.complaint-card',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [loading, activeProvince]);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div className="gallery-page">

            {/* HERO */}
            <section className="gallery-hero">
                <div className="gallery-hero-overlay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/WerangaR_Old_Parliament_CMB.jpeg" alt="Sri Lanka" className="gallery-hero-img" />
                <div className="gallery-hero-content">
                    <span className="g-tag">Media Gallery</span>
                    <h1>A Visual Record of<br />Public Service in Action</h1>
                    <p>Real complaints reported by citizens and their resolutions across Sri Lanka.</p>
                </div>
            </section>

            {/* PROVINCE COMPLAINT GALLERY */}
            <section className="complaints-gallery-section">
                <div className="g-section-header">
                    <span className="g-tag">Citizen Reports</span>
                    <h2>Problems Reported Across Sri Lanka</h2>
                    <p>Real images submitted by citizens — click any card to view before & after</p>
                </div>

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
                ) : error ? (
                    <div className="gallery-empty">
                        <span>🔌</span>
                        <h3>Could not connect to server</h3>
                        <p>Make sure the backend is running on port 5000.</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="gallery-empty">
                        <span>📭</span>
                        <h3>No reports found{activeProvince !== 'All' ? ` for ${activeProvince}` : ''}</h3>
                        <p>No citizen complaints with images have been submitted yet.</p>
                    </div>
                ) : (
                    <div className="complaints-grid">
                        {complaints.map(c => (
                            <div className="complaint-card" key={c._id} onClick={() => setLightbox(c)}>
                                <div className="cc-img-wrap">
                                    {/* Problem image */}
                                    <img
                                        src={`http://localhost:5000${c.imageUrls[0]}`}
                                        alt={c.title}
                                    />
                                    {/* Resolved badge */}
                                    {c.status === 'Resolved' && c.resolvedImageUrls?.length > 0 && (
                                        <div className="cc-resolved-badge">✓ Resolved</div>
                                    )}
                                    <div className="cc-overlay">
                                        <span className="cc-zoom">
                                            {c.status === 'Resolved' && c.resolvedImageUrls?.length > 0
                                                ? '🔍 View Before & After'
                                                : '🔍 View'}
                                        </span>
                                    </div>
                                </div>
                                <div className="cc-body">
                                    <div className="cc-meta">
                                        <span className="cc-province">{c.province || 'Unknown'}</span>
                                        <span className="cc-status" style={{ color: STATUS_COLOR[c.status] }}>● {c.status}</span>
                                    </div>
                                    <h4>{c.title}</h4>
                                    <div className="cc-footer">
                                        <span className="cc-dept">{c.category}</span>
                                        <span className="cc-date">{formatDate(c.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* SRI LANKA HIGHLIGHTS */}
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
                        { img: 'https://www.slpa.lk/uploads/article_main/article_image_2024_08_01_1722483060.jpg', title: 'Colombo Port', desc: 'Western Province\'s economic lifeline' },
                        { img: 'https://assets.roar.media/Life/2017/10/Cover-Image-1-Expressway-Junction--e1509004631486.jpg?w=1200', title: 'Northern Highway', desc: 'Connecting communities post-conflict' },
                    ].map((item, i) => (
                        <div className="highlight-item" key={i} onClick={() => setLightbox({ img: item.img, title: item.title, category: item.desc, status: null, province: '', createdAt: null })}>
                            <img src={item.img} alt={item.title} />
                            <div className="hi-caption">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* LIGHTBOX — shows before & after */}
            {lightbox && (
                <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
                    <div className="lightbox-box lightbox-box--wide" onClick={e => e.stopPropagation()}>
                        <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>

                        {/* Before & After images */}
                        {lightbox.imageUrls ? (
                            <div className="lb-images">
                                <div className="lb-img-section">
                                    <div className="lb-img-label problem">📸 Problem</div>
                                    <img src={`http://localhost:5000${lightbox.imageUrls[0]}`} alt="Problem" />
                                </div>
                                {lightbox.status === 'Resolved' && lightbox.resolvedImageUrls?.length > 0 ? (
                                    <div className="lb-img-section">
                                        <div className="lb-img-label resolved">✅ Resolved</div>
                                        <img src={`http://localhost:5000${lightbox.resolvedImageUrls[0]}`} alt="Resolved" />
                                    </div>
                                ) : lightbox.status !== 'Resolved' ? (
                                    <div className="lb-img-section lb-not-resolved">
                                        <div className="lb-img-label pending">⏳ Not Yet Resolved</div>
                                        <div className="lb-pending-placeholder">
                                            <span style={{ fontSize: '3rem' }}>🔧</span>
                                            <p>This issue has not been resolved yet.</p>
                                            <span className="cc-status" style={{ color: STATUS_COLOR[lightbox.status] }}>
                                                ● {lightbox.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="lb-img-section lb-not-resolved">
                                        <div className="lb-img-label resolved">✅ Resolved</div>
                                        <div className="lb-pending-placeholder">
                                            <span style={{ fontSize: '3rem' }}>✓</span>
                                            <p>Issue resolved — no photo uploaded.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <img src={lightbox.img} alt={lightbox.title} style={{ width: '100%', borderRadius: 8 }} />
                        )}

                        <div className="lb-info">
                            <h3>{lightbox.title}</h3>
                            <div className="lb-meta">
                                {lightbox.province && <span className="cc-province">{lightbox.province}</span>}
                                {lightbox.status && <span className="cc-status" style={{ color: STATUS_COLOR[lightbox.status] }}>● {lightbox.status}</span>}
                                {lightbox.category && <span className="cc-dept">{lightbox.category}</span>}
                            </div>
                            {lightbox.createdAt && (
                                <span className="cc-date">Filed: {new Date(lightbox.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            )}
                            {lightbox.resolvedDate && (
                                <span className="cc-date" style={{ color: '#1D9E75', marginLeft: 8 }}>
                                    Resolved: {new Date(lightbox.resolvedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;