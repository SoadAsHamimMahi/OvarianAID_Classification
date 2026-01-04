import React, { useState, useEffect } from 'react';
import logo from '../assets/Logo.jpeg';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky-header py-3 px-4 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center border border-gray-200">
                        <img 
                            src={logo} 
                            alt="OvarianAID Logo" 
                            className="h-full w-full object-contain p-1.5"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">OvarianAID</h1>
                        <p className="text-xs text-gray-500 hidden md:block">AI-Powered Diagnostic</p>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Features
                    </a>
                    <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        How It Works
                    </a>
                    <a href="#about" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        About
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <button className="btn-primary hidden md:flex items-center gap-2 text-sm">
                        <span>Get Started</span>
                    </button>
                    <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;