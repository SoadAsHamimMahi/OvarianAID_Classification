import React from 'react';
import logo from '../assets/Logo.jpeg';

const Header = () => {
    return (
        <header className="sticky-header py-4 md:py-5 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="h-20 w-20 rounded-lg flex items-center justify-center shadow-md"
                           
                        >
                            <img 
                                src={logo} 
                                alt="OvarianAID Logo" 
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">OvarianAID</h1>
                            <p className="text-xs text-muted hidden md:block">AI-Powered Diagnostic Assistant</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-soft/50">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span className="text-sm font-semibold text-primary">Fast & Accurate</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary-soft to-white flex items-center justify-center text-primary hover:border-primary/40 transition-all cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;