import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';
import kasunImg from '../assets/kasun.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo('.about-hero-content h1, .about-hero-content p',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );

        gsap.fromTo('.about-text-section .about-tag, .about-text-section h2, .about-text-section p',
            { opacity: 0, x: -40 },
            {
                opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.about-text-section', start: 'top 80%' }
            }
        );

        gsap.fromTo('.dept-highlight',
            { opacity: 0, x: 40 },
            {
                opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.about-dept-section', start: 'top 80%' }
            }
        );

        gsap.fromTo('.stat-box',
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: '.facts-section', start: 'top 80%' }
            }
        );

        gsap.fromTo('.agent-card',
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: '.agents-section', start: 'top 80%' }
            }
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

    const agents = [
        {
            name: 'Mr. Kasun Perera',
            position: 'Digital Water Systems Coordinator',
            dept: 'Water Supply',
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&h=800&fit=crop'  // Professional Sri Lankan man in suit
        },
        {
            name: 'Mr. Dinuka Silva',
            position: 'Smart Grid Operations Manager',
            dept: 'Electricity',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&h=800&fit=crop'  // Confident Sri Lankan male executive
        },
        {
            name: 'Ms. Tharushi Fernando',
            position: 'Sanitation Monitoring System Officer',
            dept: 'Garbage & Sanitation',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&h=800&fit=crop'  // Professional Sri Lankan woman
        },
        {
            name: 'Dr. Nadeesha Jayasinghe',
            position: 'Public Health Data Systems Manager',
            dept: 'Health',
            img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&h=800&fit=crop'  // Sri Lankan female professional (doctor/manager look)
        },
        {
            name: 'Mr. Lahiru Wickramasinghe',
            position: 'Digital Crime Reporting Coordinator',
            dept: 'Police',
            img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&h=800&fit=crop'  // Serious professional Sri Lankan man
        },
        {
            name: 'Mr. Chamod Gunawardena',
            position: 'Agri-Tech Monitoring Officer',
            dept: 'Agriculture',
            img: 'https://media.tommy.com/us/static/images/scheduled_marketing/2025/08/PLP_FH_MUnderwear_briefs_dt.jpg'  // Sri Lankan man in professional attire
        },
        {
            name: 'Ms. Ishara Ranasinghe',
            position: 'Education Systems & E-Learning Manager',
            dept: 'Education',
            img: 'https://nypost.com/wp-content/uploads/sites/2/2024/12/2025-sophie-rain-20-told-95860329.jpg?w=768'  // Professional Sri Lankan woman
        },
        {
            name: 'Mr. Sandun Rajapaksha',
            position: 'Infrastructure Monitoring Systems Officer',
            dept: 'Roads & Highways',
            img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&h=800&fit=crop'  // Sri Lankan male professional
        },
        {
            name: 'Ms. Piumi Abeysekara',
            position: 'Environmental Data & Reporting Analyst',
            dept: 'Environment',
            img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=800&fit=crop'  // Elegant Sri Lankan woman professional
        },
        {
            name: 'Mr. Kavindu Senanayake',
            position: 'Transport Operations Digital Coordinator',
            dept: 'Transport',
            img: 'https://www.lovepanky.com/wp-content/uploads/2020/11/what-makes-a-man-a-man-1.jpg'  // Professional Sri Lankan man
        },
        {
            name: 'Mr. Ramesh De Silva',
            position: 'Municipal E-Governance Officer',
            dept: 'Municipal Council',
            img: 'https://i.pinimg.com/564x/ec/c2/ca/ecc2ca1268ba8aed3300997a87000e9f.jpg'  // Mature Sri Lankan professional
        },
        {
            name: 'Ms. Dilani Weerakoon',
            position: 'Labour Compliance Systems Manager',
            dept: 'Labour & Employment',
            img: 'https://s.yimg.com/ny/api/res/1.2/A8eIX6ms2tcYxkt8EsffIQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTEyMDA7Y2Y9d2VicA--/https://media.zenfs.com/en/theblast_73/0926c287206a304544ebb812185af2af'  // Professional Sri Lankan woman
        }
    ];

    return (
        <div className="about-page">

            {/* HERO */}
            <section className="about-hero">
                <div className="about-hero-overlay" />
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/18/WerangaR_Old_Parliament_CMB.jpeg"
                    alt="Sri Lanka Government"
                    className="about-hero-img"
                />
                <div className="about-hero-content">
                    <span className="about-tag">About Us</span>
                    <h1>Serving Every Sri Lankan<br />Citizen With Dignity</h1>
                    <p>A unified digital platform connecting citizens to government services — transparent, efficient, and built for all.</p>
                </div>
            </section>

            {/* ABOUT US TEXT */}
            <section className="about-text-section">
                <div className="about-text-content">
                    <span className="about-tag dark">Who We Are</span>
                    <h2>About Us</h2>
                    <p>
                        The Public Problem Reporting System of Sri Lanka is a government-backed digital initiative
                        designed to bridge the gap between citizens and public service departments. Our platform
                        empowers every Sri Lankan — regardless of location or background — to report infrastructure
                        failures, request emergency services, and track the resolution of their complaints in real time.
                    </p>
                    <p>
                        Built with transparency and accountability at its core, we work alongside the Ministry of
                        Public Administration, local municipal councils, and national service boards to ensure that
                        every complaint is heard, reviewed, and resolved within a committed timeframe.
                    </p>
                    <button className="about-btn" onClick={() => navigate('/services')}>
                        Our Services
                    </button>
                </div>
                <div className="about-text-image">
                    <img
                        src="https://i.pinimg.com/1200x/1d/f0/b8/1df0b877dd8d187ac3b9d64bd0487631.jpg"
                        alt="Government Building Sri Lanka"
                    />
                </div>
            </section>

            {/* DEPARTMENTS */}
            <section className="about-dept-section">
                <div className="dept-image">
                    <img
                        src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=700&q=80"
                        alt="Sri Lanka Departments"
                    />
                </div>
                <div className="dept-content">
                    <span className="about-tag dark">Government Departments</span>
                    <h2>Our Departments</h2>
                    <p>
                        We coordinate directly with all major government departments across Sri Lanka to ensure
                        complaints reach the right authority and are resolved efficiently. Each department has
                        dedicated agents monitoring and responding to citizen reports on our platform.
                    </p>
                    <div className="dept-highlights">
                        {['Water Supply & Drainage', 'Ceylon Electricity Board', 'Municipal Councils', 'Ministry of Health', 'Sri Lanka Police', 'Disaster Management Centre'].map((d, i) => (
                            <div className="dept-highlight" key={i}>
                                <span>✓</span> {d}
                            </div>
                        ))}
                    </div>
                    <button className="about-btn" onClick={() => navigate('/departments')}>
                        Our Departments
                    </button>
                </div>
            </section>

            {/* FAST FACTS */}
            <section className="facts-section">
                <div className="facts-header">
                    <span className="about-tag">By The Numbers</span>
                    <h2>Sri Lanka Civic Portal — Fast Facts</h2>
                    <p>Real impact across the island</p>
                </div>
                <div className="facts-grid">
                    {stats.map((stat, index) => (
                        <div className="stat-box" key={index}>
                            <h3>{stat.number}</h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* GOVERNMENT AGENTS */}
            <section className="agents-section">
                <div className="facts-header">
                    <span className="about-tag dark">Our Team</span>
                    <h2>Government Agents</h2>
                    <p>The dedicated officials managing your complaints</p>
                </div>
                <div className="agents-grid">
                    {agents.map((agent, index) => (
                        <div className="agent-card" key={index}>
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
            </section>

        </div>
    );
};

export default About;