import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import emblem from '../assets/emblem.png';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Close drawer on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    // Close drawer on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock / unlock background scroll
    useEffect(() => {
        if (menuOpen) {
            // Save current scroll position and lock
            const scrollY = window.scrollY;
            document.body.style.position   = 'fixed';
            document.body.style.top        = `-${scrollY}px`;
            document.body.style.width      = '100%';
            document.body.style.overflowY  = 'scroll'; // keep scrollbar space
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position  = '';
            document.body.style.top       = '';
            document.body.style.width     = '';
            document.body.style.overflowY = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            document.body.style.position  = '';
            document.body.style.top       = '';
            document.body.style.width     = '';
            document.body.style.overflowY = '';
        };
    }, [menuOpen]);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu  = () => setMenuOpen(false);

    return (
        <>
            <nav className="navbar">

                {/* LEFT — Logo */}
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">
                        <img src={emblem} alt="Sri Lanka Emblem" className="emblem-img" />
                        <span>Public Problem Reporting System</span>
                    </Link>
                </div>

                {/* CENTER — Desktop links */}
                <div className="navbar-center">
                    <ul className="navbar-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                    </ul>
                </div>

                {/* RIGHT — Desktop auth buttons */}
                <div className="navbar-right">
                    <Link to="/signup" className="btn-signup">Sign Up</Link>
                    <Link to="/signin" className="btn-signin">Sign In</Link>
                </div>

                {/* HAMBURGER — mobile only */}
                <button
                    className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </button>

            </nav>

            {/* OVERLAY — only interactive when open */}
            <div
                className={`navbar-mobile-overlay ${menuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
                style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
            />

            {/* MOBILE DRAWER */}
            <div
                className={`navbar-mobile-menu ${menuOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="mobile-menu-header">
                    <img src={emblem} alt="Sri Lanka Emblem" className="emblem-img" />
                    <span>Public Problem Reporting System</span>
                </div>

                <ul className="mobile-menu-links">
                    <li><Link to="/"         onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/about"    onClick={closeMenu}>About</Link></li>
                    <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
                    <li><Link to="/gallery"  onClick={closeMenu}>Gallery</Link></li>
                </ul>

                <div className="mobile-menu-auth">
                    <Link to="/signup" className="btn-signup" onClick={closeMenu}>Sign Up</Link>
                    <Link to="/signin" className="btn-signin" onClick={closeMenu}>Sign In</Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;