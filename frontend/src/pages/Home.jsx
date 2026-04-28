import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import WeatherSection from '../components/WeatherCard';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef     = useRef(null);
    const titleRef    = useRef(null);
    const subtitleRef = useRef(null);
    const searchRef   = useRef(null);
    const servicesRef = useRef(null);
    const statsRef    = useRef(null);
    const hiwRef      = useRef(null);

    useEffect(() => {
        // Set initial states so mobile never gets stuck at opacity:0
        gsap.set([titleRef.current, subtitleRef.current, searchRef.current], {
            opacity: 0, y: 30,
        });

        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
            .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
            .to(searchRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        gsap.fromTo('.service-card',
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
                scrollTrigger: { trigger: servicesRef.current, start: 'top 85%', once: true },
            }
        );

        gsap.fromTo('.stat-item',
            { opacity: 0, y: 25 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
            }
        );

        gsap.fromTo('.hiw-left .hiw-tag, .hiw-left h2, .hiw-left p, .hiw-buttons',
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 80%', once: true },
            }
        );

        gsap.fromTo('.hiw-step',
            { opacity: 0, x: 40 },
            {
                opacity: 1, x: 0, duration: 0.5, stagger: 0.18, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 80%', once: true },
            }
        );

        const t = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => {
            clearTimeout(t);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    const services = [
        { icon: '💧', title: 'Water Supply',  desc: 'Report pipe breaks, water shortages and supply issues',        color: '#185FA5' },
        { icon: '⚡', title: 'Electricity',   desc: 'Report power outages, electrical faults and breakdowns',        color: '#1D9E75' },
        { icon: '🗑️', title: 'Garbage',       desc: 'Report uncollected waste, illegal dumps and sanitation issues', color: '#042C53' },
        { icon: '🏥', title: 'Health',        desc: 'Report health hazards and request medical assistance',          color: '#185FA5' },
        { icon: '👮', title: 'Police',        desc: 'Report crimes, suspicious activity and public safety issues',   color: '#1D9E75' },
        { icon: '🌊', title: 'Disaster',      desc: 'Report natural disasters, floods and emergency situations',     color: '#042C53' },
        { icon: '🌾', title: 'Agriculture',   desc: 'Report crop diseases, irrigation issues and farming problems',  color: '#185FA5' },
        { icon: '🎓', title: 'Education',     desc: 'Report school infrastructure and educational service issues',   color: '#1D9E75' },
    ];

    return (
        <div className="home">

            {/* ── HERO ─────────────────────────────────────── */}
            <section className="hero" ref={heroRef}>
                <div className="hero-content">
                    <h1 ref={titleRef}>
                        Public Problem Reporting<br />System Sri Lanka
                    </h1>
                    <p ref={subtitleRef}>
                        A unified platform connecting citizens with government departments.
                        Report issues, track resolutions, and help build a better Sri Lanka.
                    </p>
                    <div className="hero-search" ref={searchRef}>
                        <input type="text" placeholder="Search Anything..." />
                        <button>Search</button>
                    </div>
                    <div className="hero-badges">
                        <span>🚨 Emergency Services</span>
                        <span>📍 Track Your Complaint</span>
                        <span>🔔 Real-time Updates</span>
                    </div>
                </div>
            </section>

            {/* Floating buttons — OUTSIDE hero so overflow never clips them */}
            <div className="floating-actions">
                <button className="fab emergency">🚑<span>Emergency</span></button>
                <button className="fab chat">💬<span>Live Chat</span></button>
            </div>

            {/* ── HOW IT WORKS ─────────────────────────────── */}
            <section className="how-it-works" ref={hiwRef}>
                <div className="hiw-left">
                    <span className="hiw-tag">How It Works</span>
                    <h2>How Our Complaint<br />System Works</h2>
                    <p>
                        From burst water pipes to power outages — report any public infrastructure
                        issue directly to the relevant government department. Upload photos, track
                        your complaint, and get a resolution timeline. Simple, transparent, and
                        built for every Sri Lankan citizen.
                    </p>
                    <div className="hiw-buttons">
                        <button className="hiw-primary">File Complaint</button>
                        <button className="hiw-secondary">Review Complaint</button>
                    </div>
                </div>

                <div className="hiw-right">
                    {[
                        { n: '01', h: 'Submit Your Report',  p: 'Fill the complaint form with photos and your location details' },
                        { n: '02', h: 'Department Reviews',  p: 'The relevant department inspects and analyses your complaint' },
                        { n: '03', h: 'Get Resolution',      p: 'Receive a timeline for when your issue will be fixed' },
                        { n: '04', h: 'Follow Up',           p: "Still unresolved? Escalate with proof and we'll push it further" },
                    ].map(step => (
                        <div className="hiw-step" key={step.n}>
                            <div className="step-badge">{step.n}</div>
                            <div className="step-content">
                                <h4>{step.h}</h4>
                                <p>{step.p}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── STATS ────────────────────────────────────── */}
            <section className="stats-section" ref={statsRef}>
                <div className="stat-item"><h3>12,450+</h3><p>Complaints Resolved</p></div>
                <div className="stat-item"><h3>9</h3><p>Provinces Covered</p></div>
                <div className="stat-item"><h3>8+</h3><p>Government Departments</p></div>
                <div className="stat-item"><h3>24/7</h3><p>Emergency Support</p></div>
            </section>

            {/* ── SERVICES ─────────────────────────────────── */}
            <section className="services-section" ref={servicesRef}>
                <div className="section-header">
                    <h2>Report to the Right Department</h2>
                    <p>Select a department to file your complaint directly</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div
                            className="service-card"
                            key={index}
                            style={{ '--accent': service.color }}
                        >
                            <div className="service-icon">{service.icon}</div>
                            {/* service-card-body wraps text+button for the mobile row layout */}
                            <div className="service-card-body">
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <button>Report Now →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WEATHER ──────────────────────────────────── */}
            <WeatherSection />

            {/* ── CTA ──────────────────────────────────────── */}
            <section className="cta-section">
                <h2>Have an Issue to Report?</h2>
                <p>Join thousands of Sri Lankan citizens making their communities better</p>
                <div className="cta-buttons">
                    <button className="cta-primary">File a Complaint</button>
                    <button className="cta-secondary">Learn More</button>
                </div>
            </section>

        </div>
    );
};

export default Home;