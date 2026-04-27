<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">
                    <h2>Public Problem Reporting System</h2>
                    <p>
<<<<<<< HEAD
                        A Government system where citizens can report their public problems and get real-time updates with reliable communication.
                    </p>
                </div>

                {/* NAVIGATION */}
                <div className="footer-links">
                    <h4>Navigation</h4>
=======
                        A transparent platform for citizens to report and track public
                        issues across Sri Lanka. Built to bridge communities and government.
                    </p>
                </div>

                {/* QUICK LINKS */}
                <CollapsibleSection title="Quick Links" className="footer-links">
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                    </ul>
<<<<<<< HEAD
                </div>

                {/* SERVICES */}
                <div className="footer-links">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">Departments</a></li>
                        <li><a href="#">Chat</a></li>
                        <li><a href="#">Emergency Request</a></li>
                    </ul>
                </div>

                {/* OPTIONAL EMPTY / FUTURE */}
                <div className="footer-contact">
                    <h4>Contact</h4>
                    <p><strong>Hotline:</strong> 1920</p>
                    <p><strong>Police:</strong> 119</p>
                    <p><strong>Ambulance:</strong> 1920</p>
                    <p><strong>Fire:</strong> 111</p>
                </div>
=======
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
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9

            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
<<<<<<< HEAD
                <p>&copy; Public Problem Reporting System Sri Lanka 2026 All Right Reserved</p>
                <div className="footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF />
                    </a>

                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>

                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
=======
                <p>© {new Date().getFullYear()} Public Problem Reporting System. All rights reserved.</p>
                <div className="footer-social">
                    <a href="https://facebook.com"  aria-label="Facebook"  target="_blank" rel="noreferrer">f</a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">in</a>
                    <a href="https://twitter.com"   aria-label="Twitter"   target="_blank" rel="noreferrer">𝕏</a>
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
                </div>
            </div>
        </footer>
    );
};

export default Footer;