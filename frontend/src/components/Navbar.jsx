import React, { useState, useEffect } from 'react';
import emblem from '../assets/emblem.png';
import './Navbar.css';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen]     = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

    /* ── Check login state on every route change ── */
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position  = 'fixed';
            document.body.style.top       = `-${scrollY}px`;
            document.body.style.width     = '100%';
            document.body.style.overflowY = 'scroll';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position  = '';
            document.body.style.top       = '';
            document.body.style.width     = '';
            document.body.style.overflowY = '';
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">
                        <img src={emblem} alt="Sri Lanka Emblem" className="emblem-img" />
                        <span>Public Problem Reporting System</span>
                    </Link>
                </div>

                <div className="navbar-center">
                    <ul className="navbar-links">
                        <li><NavLink to="/" end>Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/services">Services</NavLink></li>
                        <li><NavLink to="/gallery">Gallery</NavLink></li>
                    </ul>
                </div>

                <div className="navbar-right">
                    {isLoggedIn ? (
                        <Link to="/profile" className="btn-profile" title="My Profile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Profile
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="btn-signup">Sign Up</Link>
                            <Link to="/signin" className="btn-signin">Sign In</Link>
                        </>
                    )}
                </div>

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

            <div
                className={`navbar-mobile-overlay ${menuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
                style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
            />

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
                    <li><NavLink to="/"       end onClick={closeMenu}>Home</NavLink></li>
                    <li><NavLink to="/about"      onClick={closeMenu}>About</NavLink></li>
                    <li><NavLink to="/services"   onClick={closeMenu}>Services</NavLink></li>
                    <li><NavLink to="/gallery"    onClick={closeMenu}>Gallery</NavLink></li>
                </ul>

                <div className="mobile-menu-auth">
                    {isLoggedIn ? (
                        <Link to="/profile" className="btn-profile" onClick={closeMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Profile
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="btn-signup" onClick={closeMenu}>Sign Up</Link>
                            <Link to="/signin" className="btn-signin" onClick={closeMenu}>Sign In</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;