// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="header">
            <nav className="navbar">
                <div className="logo">
                    <h1>QR App</h1>
                </div>
                <div className="menu-toggle" onClick={toggleMenu}>
                    ☰ {/* Hamburger icon */}
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
                    <li>
                        <Link to="/" onClick={toggleMenu}>QR Code Generator</Link>
                    </li>
                    <li>
                        <Link to="/qr-scanner" onClick={toggleMenu}>QR Scanner</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
