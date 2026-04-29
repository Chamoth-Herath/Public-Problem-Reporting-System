import React, { useEffect, useRef, useState } from 'react';
import './PrivacyPolicy.css';

const sections = [
    {
        icon: '📋',
        title: '1. Information We Collect',
        content: 'We collect information you provide when submitting complaints, including your name, contact details, location, and issue descriptions. This also includes device information and usage data to improve system performance.'
    },
    {
        icon: '🎯',
        title: '2. How We Use Your Information',
        content: 'Your information is used solely to process and resolve your reported issues, communicate updates, and improve our services. We may also use anonymized data for statistical analysis to better serve Sri Lankan citizens.'
    },
    {
        icon: '🤝',
        title: '3. Data Sharing',
        content: 'We share your complaint details only with the relevant government departments responsible for resolving your issue. We do not sell your data to third parties under any circumstances.'
    },
    {
        icon: '🔒',
        title: '4. Data Security',
        content: 'We implement industry-standard security measures including encryption and secure servers to protect your personal information from unauthorized access, alteration, or disclosure.'
    },
    {
        icon: '⚖️',
        title: '5. Your Rights',
        content: 'You have the right to access, correct, or delete your personal data at any time. You may also request a copy of your data or object to its processing. Contact us at support@pprs.gov.lk for any data-related requests.'
    },
    {
        icon: '📞',
        title: '6. Contact Us',
        content: 'If you have questions about this Privacy Policy, contact us at support@pprs.gov.lk or call +94 11 234 5678. Our data protection team is available Monday to Friday, 8am to 5pm.'
    },
];

const PolicyCard = ({ icon, title, content, index }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`policy-card ${visible ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
        >
            <div className="policy-card-icon">{icon}</div>
            <div className="policy-card-content">
                <h2>{title}</h2>
                <p>{content}</p>
            </div>
        </div>
    );
};

const PrivacyPolicy = () => {
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => setHeroVisible(true), 100);
    }, []);

    return (
        <div className="privacy-page">

            {/* Hero */}
            <div className={`privacy-hero ${heroVisible ? 'visible' : ''}`}>
                <div className="privacy-hero-content">
                    <span className="privacy-badge">🛡️ Legal</span>
                    <h1>Privacy Policy</h1>
                    <p>We are committed to protecting your personal information and your right to privacy.</p>
                    <span className="privacy-date">Last updated: January 2026</span>
                </div>
            </div>

            {/* Cards */}
            <div className="privacy-cards">
                {sections.map((section, index) => (
                    <PolicyCard
                        key={index}
                        index={index}
                        icon={section.icon}
                        title={section.title}
                        content={section.content}
                    />
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="privacy-cta">
                <h3>Still have questions?</h3>
                <p>Our team is happy to help you understand how we handle your data.</p>
                <a href="mailto:support@pprs.gov.lk" className="privacy-cta-btn">
                    Contact Us
                </a>
            </div>

        </div>
    );
};

export default PrivacyPolicy;