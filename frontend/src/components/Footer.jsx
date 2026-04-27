import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">
                    <h2>Public Problem Reporting System</h2>
                    <p>
                        A Government system where citizens can report their public problems and get real-time updates with reliable communication.
                    </p>
                </div>

                {/* NAVIGATION */}
                <div className="footer-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                    </ul>
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

            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;