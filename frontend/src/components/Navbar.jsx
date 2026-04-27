import React from 'react';
import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.png';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">

            {/* LEFT */}
            <div className="navbar-left">
                <div className="navbar-logo">
                    <img src={emblem} alt="Sri Lanka Emblem" className="emblem-img" />
                    <span>Public Problem Reporting System</span>
                </div>
            </div>

            {/* CENTER */}
            <div className="navbar-center">
                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/About">About</Link></li>
                    <li><Link to="services">Services</Link></li>
                    <li><Link to="/gallery">Gallery</Link></li>
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-right">
                <Link to="/signup" className="btn-signup">Signup</Link>
                <Link to="/signin" className="btn-signin">Signin</Link>
            </div>

        </nav>
    );
};

export default Navbar;