import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
<<<<<<< HEAD
=======
import WeatherSection from '../components/WeatherCard';
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
<<<<<<< HEAD
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const searchRef = useRef(null);
    const servicesRef = useRef(null);
    const weatherRef = useRef(null);
    const statsRef = useRef(null);
    const hiwRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
            )
            .fromTo(searchRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4'
            );

        gsap.fromTo('.service-card',
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: servicesRef.current, start: 'top 80%' }
            }
        );

        gsap.fromTo('.province-card',
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
                scrollTrigger: { trigger: weatherRef.current, start: 'top 80%' }
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
            }
        );

        gsap.fromTo('.stat-item',
<<<<<<< HEAD
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
=======
            { opacity: 0, y: 25 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
            }
        );

        gsap.fromTo('.hiw-left .hiw-tag, .hiw-left h2, .hiw-left p, .hiw-buttons',
<<<<<<< HEAD
            { opacity: 0, x: -40 },
            {
                opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 75%' }
=======
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 80%', once: true },
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
            }
        );

        gsap.fromTo('.hiw-step',
<<<<<<< HEAD
            { opacity: 0, x: 60 },
            {
                opacity: 1, x: 0, duration: 0.6, stagger: 0.25, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 75%' }
            }
        );

    }, []);

    const services = [
        { icon: '💧', title: 'Water Supply', desc: 'Report pipe breaks, water shortages and supply issues', color: '#185FA5' },
        { icon: '⚡', title: 'Electricity', desc: 'Report power outages, electrical faults and breakdowns', color: '#1D9E75' },
        { icon: '🗑️', title: 'Garbage', desc: 'Report uncollected waste, illegal dumps and sanitation issues', color: '#042C53' },
        { icon: '🏥', title: 'Health', desc: 'Report health hazards and request medical assistance', color: '#185FA5' },
        { icon: '👮', title: 'Police', desc: 'Report crimes, suspicious activity and public safety issues', color: '#1D9E75' },
        { icon: '🌊', title: 'Disaster', desc: 'Report natural disasters, floods and emergency situations', color: '#042C53' },
        { icon: '🌾', title: 'Agriculture', desc: 'Report crop diseases, irrigation issues and farming problems', color: '#185FA5' },
        { icon: '🎓', title: 'Education', desc: 'Report school infrastructure and educational service issues', color: '#1D9E75' },
    ];

    const provinces = [
        'Western', 'Central', 'Southern', 'Northern',
        'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
    ];

    return (
        <div className="home">

<<<<<<< HEAD
            {/* Hero Section */}
            <section className="hero" ref={heroRef}>
                <div className="hero-content">
                    <h1 ref={titleRef}>Public Problem Reporting<br />System Sri Lanka</h1>
=======
            {/* ── HERO ─────────────────────────────────────── */}
            <section className="hero" ref={heroRef}>
                <div className="hero-content">
                    <h1 ref={titleRef}>
                        Public Problem Reporting<br />System Sri Lanka
                    </h1>
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
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
<<<<<<< HEAD
                <div className="floating-actions">
                    <button className="fab emergency">🚑<span>Emergency</span></button>
                    <button className="fab chat">💬<span>Live Chat</span></button>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="stat-item">
                    <h3>12,450+</h3>
                    <p>Complaints Resolved</p>
                </div>
                <div className="stat-item">
                    <h3>9</h3>
                    <p>Provinces Covered</p>
                </div>
                <div className="stat-item">
                    <h3>8+</h3>
                    <p>Government Departments</p>
                </div>
                <div className="stat-item">
                    <h3>24/7</h3>
                    <p>Emergency Support</p>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section" ref={servicesRef}>
                <div className="section-header">
                    <h2>Report to the Right Department</h2>
                    <p>Select a department to file your complaint directly</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index} style={{ '--accent': service.color }}>
                            <div className="service-icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <button>Report Now →</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
=======
            </section>

            {/* Floating buttons — OUTSIDE hero so overflow never clips them */}
            <div className="floating-actions">
                <button className="fab emergency">🚑<span>Emergency</span></button>
                <button className="fab chat">💬<span>Live Chat</span></button>
            </div>

            {/* ── HOW IT WORKS ─────────────────────────────── */}
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
            <section className="how-it-works" ref={hiwRef}>
                <div className="hiw-left">
                    <span className="hiw-tag">How It Works</span>
                    <h2>How Our Complaint<br />System Works</h2>
                    <p>
                        From burst water pipes to power outages — report any public infrastructure
                        issue directly to the relevant government department. Upload photos, track
<<<<<<< HEAD
                        your complaint, and get a resolution timeline. Simple, transparent, and built
                        for every Sri Lankan citizen.
=======
                        your complaint, and get a resolution timeline. Simple, transparent, and
                        built for every Sri Lankan citizen.
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
                    </p>
                    <div className="hiw-buttons">
                        <button className="hiw-primary">File Complaint</button>
                        <button className="hiw-secondary">Review Complaint</button>
                    </div>
                </div>

                <div className="hiw-right">
<<<<<<< HEAD
                    <div className="hiw-step">
                        <div className="step-badge">01</div>
                        <div className="step-content">
                            <h4>Submit Your Report</h4>
                            <p>Fill the complaint form with photos and your location details</p>
                        </div>
                    </div>
                    <div className="hiw-step">
                        <div className="step-badge">02</div>
                        <div className="step-content">
                            <h4>Department Reviews</h4>
                            <p>The relevant department inspects and analyses your complaint</p>
                        </div>
                    </div>
                    <div className="hiw-step">
                        <div className="step-badge">03</div>
                        <div className="step-content">
                            <h4>Get Resolution</h4>
                            <p>Receive a timeline for when your issue will be fixed</p>
                        </div>
                    </div>
                    <div className="hiw-step">
                        <div className="step-badge">04</div>
                        <div className="step-content">
                            <h4>Follow Up</h4>
                            <p>Still unresolved? Escalate with proof and we'll push it further</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weather Section */}
            <section className="weather-section" ref={weatherRef}>
                <div className="section-header light">
                    <h2>Weather Forecast by Province</h2>
                    <p>Stay informed about weather conditions across Sri Lanka</p>
                </div>
                <div className="provinces-grid">
                    {provinces.map((province, index) => (
                        <div className="province-card" key={index}>
                            <span className="province-icon">🌤️</span>
                            <h4>{province}</h4>
                            <p>Province</p>
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
                        </div>
                    ))}
                </div>
            </section>

<<<<<<< HEAD
            {/* CTA Section */}
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
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