import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import WeatherSection from '../components/WeatherCard';

gsap.registerPlugin(ScrollTrigger);

/* ── Count-up hook ── */
const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const isFloat = target % 1 !== 0;
                const startTime = performance.now();
                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.4 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
};

const parseStatValue = (str) => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    const prefix = str.match(/^[^0-9]*/)?.[0] || '';
    const suffix = str.match(/[^0-9.]+$/)?.[0] || '';
    return { num, prefix, suffix };
};

const StatItem = ({ number, label }) => {
    const { num, prefix, suffix } = parseStatValue(number);
    const { count, ref } = useCountUp(num, 2000);
    return (
        <div className="stat-item" ref={ref}>
            <h3>{prefix}{count}{suffix}</h3>
            <p>{label}</p>
        </div>
    );
};

const Home = () => {
    const heroRef     = useRef(null);
    const titleRef    = useRef(null);
    const subtitleRef = useRef(null);
    const searchRef   = useRef(null);
    const servicesRef = useRef(null);
    const hiwRef      = useRef(null);

    useEffect(() => {
        gsap.set([titleRef.current, subtitleRef.current, searchRef.current], {
            opacity: 0, y: 30,
        });

        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
            .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
            .to(searchRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        /* Service cards — every single card, staggered */
        gsap.fromTo('.service-card',
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out',
                scrollTrigger: { trigger: servicesRef.current, start: 'top 85%', once: true },
            }
        );

        /* Section header lines animate independently */
        gsap.fromTo('.services-section .section-header h2',
            { opacity: 0, y: 24 },
            {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: '.services-section .section-header', start: 'top 88%', once: true },
            }
        );
        gsap.fromTo('.services-section .section-header p',
            { opacity: 0, y: 18 },
            {
                opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.services-section .section-header', start: 'top 88%', once: true },
            }
        );

        /* How it works */
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

        /* Weather section — fade up with a gentle scale */
        gsap.fromTo('.weather-section',
            { opacity: 0, y: 40, scale: 0.98 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.weather-section', start: 'top 88%', once: true },
            }
        );
        /* Individual weather cards stagger in */
        gsap.fromTo('.weather-card',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: '.weather-section', start: 'top 85%', once: true },
            }
        );

        /* CTA section */
        gsap.fromTo('.cta-section h2, .cta-section p, .cta-buttons',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.cta-section', start: 'top 85%', once: true },
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

    const stats = [
        { number: '12450+', label: 'Complaints Resolved' },
        { number: '9',      label: 'Provinces Covered' },
        { number: '8+',     label: 'Government Departments' },
        { number: '24/7',   label: 'Emergency Support' },
    ];

    return (
        <div className="home">

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

            <div className="floating-actions">
                <button className="fab emergency">🚑<span>Emergency</span></button>
                <button className="fab chat">💬<span>Live Chat</span></button>
            </div>

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

            <section className="stats-section">
                {stats.map((stat, i) => (
                    <StatItem key={i} number={stat.number} label={stat.label} />
                ))}
            </section>

            <section className="services-section" ref={servicesRef}>
                <div className="section-header">
                    <h2>Report to the Right Department</h2>
                    <p>Select a department to file your complaint directly</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index} style={{ '--accent': service.color }}>
                            <div className="service-icon">{service.icon}</div>
                            <div className="service-card-body">
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <button>Report Now →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <WeatherSection />

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