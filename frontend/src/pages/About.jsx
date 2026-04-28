import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const getCardsVisible = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
};

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

const StatBox = ({ number, label }) => {
    const { num, prefix, suffix } = parseStatValue(number);
    const { count, ref } = useCountUp(num, 2000);
    return (
        <div className="stat-box" ref={ref}>
            <h3>{prefix}{count}{suffix}</h3>
            <p>{label}</p>
        </div>
    );
};

const About = () => {
    const navigate = useNavigate();
    const carouselRef = useRef(null);
    const autoPlayRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsVisible, setCardsVisible] = useState(getCardsVisible);

    const agents = [
        { name: 'Mr. Kasun Perera', position: 'Digital Water Systems Coordinator', dept: 'Water Supply', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Dinuka Silva', position: 'Smart Grid Operations Manager', dept: 'Electricity', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&h=800&fit=crop' },
        { name: 'Ms. Tharushi Fernando', position: 'Sanitation Monitoring System Officer', dept: 'Garbage & Sanitation', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&h=800&fit=crop' },
        { name: 'Dr. Nadeesha Jayasinghe', position: 'Public Health Data Systems Manager', dept: 'Health', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Lahiru Wickramasinghe', position: 'Digital Crime Reporting Coordinator', dept: 'Police', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Chamod Gunawardena', position: 'Agri-Tech Monitoring Officer', dept: 'Agriculture', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&h=800&fit=crop' },
        { name: 'Ms. Ishara Ranasinghe', position: 'Education Systems & E-Learning Manager', dept: 'Education', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Sandun Rajapaksha', position: 'Infrastructure Monitoring Systems Officer', dept: 'Roads & Highways', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&h=800&fit=crop' },
        { name: 'Ms. Piumi Abeysekara', position: 'Environmental Data & Reporting Analyst', dept: 'Environment', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Kavindu Senanayake', position: 'Transport Operations Digital Coordinator', dept: 'Transport', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&h=800&fit=crop' },
        { name: 'Mr. Ramesh De Silva', position: 'Municipal E-Governance Officer', dept: 'Municipal Council', img: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?q=80&w=800&h=800&fit=crop' },
        { name: 'Ms. Dilani Weerakoon', position: 'Labour Compliance Systems Manager', dept: 'Labour & Employment', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=800&h=800&fit=crop' }
    ];

    const maxIndex = agents.length - cardsVisible;

    useEffect(() => {
        const handleResize = () => {
            setCardsVisible(getCardsVisible());
            setCurrentIndex(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const goNext = useCallback(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const goPrev = useCallback(() => {
        setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    const startAutoPlay = useCallback(() => {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(goNext, 2500);
    }, [goNext]);

    const stopAutoPlay = useCallback(() => {
        clearInterval(autoPlayRef.current);
    }, []);

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [startAutoPlay, stopAutoPlay]);

    useEffect(() => {
        if (carouselRef.current) {
            const viewportWidth = carouselRef.current.parentElement.offsetWidth;
            const gap = 24;
            const cardWidth = (viewportWidth - gap * (cardsVisible - 1)) / cardsVisible;
            const offset = currentIndex * (cardWidth + gap);
            gsap.to(carouselRef.current, { x: -offset, duration: 0.6, ease: 'power3.out' });
        }
    }, [currentIndex, cardsVisible]);

    useEffect(() => {
        gsap.fromTo('.about-hero-content h1, .about-hero-content p',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
        gsap.fromTo('.about-text-section .about-tag, .about-text-section h2, .about-text-section p',
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.about-text-section', start: 'top 80%' } }
        );
        gsap.fromTo('.dept-highlight',
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.about-dept-section', start: 'top 80%' } }
        );
    }, []);

    const stats = [
        { number: '22M+', label: 'Citizens Served' },
        { number: '9', label: 'Provinces Covered' },
        { number: '12', label: 'Government Departments' },
        { number: '24/7', label: 'Emergency Support' },
        { number: '50K+', label: 'Complaints Resolved' },
        { number: '340+', label: 'District Offices' },
        { number: '98%', label: 'Response Rate' },
        { number: '2026', label: 'Established' },
    ];

    return (
        <div className="about-page">

            <section className="about-hero">
                <div className="about-hero-overlay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/WerangaR_Old_Parliament_CMB.jpeg" alt="Sri Lanka Government" className="about-hero-img" />
                <div className="about-hero-content">
                    <span className="about-tag">About Us</span>
                    <h1>Serving Every Sri Lankan<br />Citizen With Dignity</h1>
                    <p>A unified digital platform connecting citizens to government services — transparent, efficient, and built for all.</p>
                </div>
            </section>

            <section className="about-text-section">
                <div className="about-text-content">
                    <span className="about-tag dark">Who We Are</span>
                    <h2>About Us</h2>
                    <p>The Public Problem Reporting System of Sri Lanka is a government-backed digital initiative designed to bridge the gap between citizens and public service departments. Our platform empowers every Sri Lankan — regardless of location or background — to report infrastructure failures, request emergency services, and track the resolution of their complaints in real time.</p>
                    <p>Built with transparency and accountability at its core, we work alongside the Ministry of Public Administration, local municipal councils, and national service boards to ensure that every complaint is heard, reviewed, and resolved within a committed timeframe.</p>
                    <button className="about-btn" onClick={() => navigate('/services')}>Our Services</button>
                </div>
                <div className="about-text-image">
                    <img src="https://i.pinimg.com/1200x/1d/f0/b8/1df0b877dd8d187ac3b9d64bd0487631.jpg" alt="Government Building Sri Lanka" />
                </div>
            </section>

            <section className="about-dept-section">
                <div className="dept-image">
                    <img src="https://www.attractionsinsrilanka.com/wp-content/uploads/2019/08/Sri-Lankan-Parliament-Complex.jpg" alt="Sri Lanka Departments" />
                </div>
                <div className="dept-content">
                    <span className="about-tag dark">Government Departments</span>
                    <h2>Our Departments</h2>
                    <p>We coordinate directly with all major government departments across Sri Lanka to ensure complaints reach the right authority and are resolved efficiently.</p>
                    <div className="dept-highlights">
                        {['Water Supply & Drainage', 'Ceylon Electricity Board', 'Municipal Councils', 'Ministry of Health', 'Sri Lanka Police', 'Disaster Management Centre'].map((d, i) => (
                            <div className="dept-highlight" key={i}><span>✓</span> {d}</div>
                        ))}
                    </div>
                    <button className="about-btn" onClick={() => navigate('/departments')}>Our Departments</button>
                </div>
            </section>

            <section className="facts-section">
                <div className="facts-header">
                    <span className="about-tag">By The Numbers</span>
                    <h2>Sri Lanka Civic Portal — Fast Facts</h2>
                    <p>Real impact across the island</p>
                </div>
                <div className="facts-grid">
                    {stats.map((stat, index) => (
                        <StatBox key={index} number={stat.number} label={stat.label} />
                    ))}
                </div>
            </section>

            <section className="agents-section">
                <div className="facts-header">
                    <span className="about-tag dark">Our Team</span>
                    <h2>Government Agents</h2>
                    <p>The dedicated officials managing your complaints</p>
                </div>
                <div className="carousel-wrapper" onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}>
                    <button className="carousel-arrow carousel-arrow-left" onClick={goPrev} aria-label="Previous">&#8592;</button>
                    <div className="carousel-viewport">
                        <div className="carousel-track" ref={carouselRef}>
                            {agents.map((agent, index) => (
                                <div className="agent-card" key={index} style={{ flex: `0 0 calc((100% - ${24 * (cardsVisible - 1)}px) / ${cardsVisible})` }}>
                                    <div className="agent-img-wrap">
                                        <img src={agent.img} alt={agent.name} />
                                    </div>
                                    <div className="agent-info">
                                        <span className="agent-dept">{agent.dept}</span>
                                        <h4>{agent.name}</h4>
                                        <p>{agent.position}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="carousel-arrow carousel-arrow-right" onClick={goNext} aria-label="Next">&#8594;</button>
                </div>
                <div className="carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button key={i} className={`carousel-dot${currentIndex === i ? ' active' : ''}`} onClick={() => setCurrentIndex(i)} aria-label={`Slide ${i + 1}`} />
                    ))}
                </div>
            </section>

        </div>
    );
};

export default About;