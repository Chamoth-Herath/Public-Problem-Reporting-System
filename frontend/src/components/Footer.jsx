import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const CollapsibleSection = ({ title, children, className = 'footer-links' }) => {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(prev => !prev);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div className={`${className} ${open ? 'expanded' : ''}`}>
            <h4
                onClick={toggle}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={open}
            >
                {title}
                <span className="footer-chevron" aria-hidden="true" />
            </h4>
            {children}
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">
                    <h2>Public Problem Reporting System</h2>
                    <p>
                        A transparent platform for citizens to report and track public
                        issues across Sri Lanka. Built to bridge communities and government.
                    </p>
                </div>

                {/* QUICK LINKS */}
                <CollapsibleSection title="Quick Links" className="footer-links">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                    </ul>
                </CollapsibleSection>

                {/* SERVICES */}
                <CollapsibleSection title="Services" className="footer-links">
                    <ul>
                        <li><Link to="/services">Report an Issue</Link></li>
                        <li><Link to="/services">Track Status</Link></li>
                        <li><Link to="/services">View Reports</Link></li>
                        <li><Link to="/services">Emergency</Link></li>
                    </ul>
                </CollapsibleSection>

                {/* CONTACT */}
                <CollapsibleSection title="Contact" className="footer-contact">
                    <div className="footer-contact-body">
                        <p><strong>Email:</strong> support@pprs.gov.lk</p>
                        <p><strong>Hotline:</strong> +94 11 234 5678</p>
                        <p><strong>Hours:</strong> Mon–Fri, 8am – 5pm</p>
                        <p><strong>Address:</strong> Colombo, Sri Lanka</p>
                    </div>
                </CollapsibleSection>

            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Public Problem Reporting System. All rights reserved.</p>
                <div className="footer-social">
                    <a href="https://facebook.com"  aria-label="Facebook"  target="_blank" rel="noreferrer">f</a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">in</a>
                    <a href="https://twitter.com"   aria-label="Twitter"   target="_blank" rel="noreferrer">𝕏</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;