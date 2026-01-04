import React, { useState, useEffect } from "react";
import logo from '../assets/Logo.jpeg';

export default function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setNewsletterStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setNewsletterStatus('success');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <>
            <footer className="footer-background mt-20 relative overflow-hidden">
                {/* Decorative Orbs */}
                <div className="footer-decorative-orb" style={{ top: '10%', left: '5%', width: '200px', height: '200px' }}></div>
                <div className="footer-decorative-orb" style={{ bottom: '20%', right: '10%', width: '150px', height: '150px' }}></div>
                
                <div className="relative w-full px-4 py-16 md:py-20 lg:py-24">
                    <div className="w-[90%] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
                        {/* Brand & Description */}
                        <div className="lg:col-span-1 fade-in-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div 
                                    className="h-16 w-16 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                                    style={{ background: 'var(--color-primary-gradient)' }}
                                >
                                    <img 
                                        src={logo} 
                                        alt="OvarianAID Logo" 
                                        className="h-full w-full object-contain p-2"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-primary leading-tight">OvarianAID</h4>
                                    <p className="text-xs text-muted">AI-Powered Diagnostic</p>
                                </div>
                            </div>
                            <p className="text-sm muted leading-relaxed mb-6">
                                Research-grade diagnostic assistance powered by advanced AI. Transform histology analysis with instant, accurate classifications—all in your browser.
                            </p>
                            
                            {/* Trust Badges */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span>Peer-Reviewed Research</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>Trusted by Researchers</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section-card fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 mb-5">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <polyline points="8 8 3 12 8 16" />
                                    <polyline points="16 8 21 12 16 16" />
                                </svg>
                                <h5 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Quick Links</h5>
                            </div>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="footer-link muted">Home</a></li>
                                <li><a href="#" className="footer-link muted">How It Works</a></li>
                                <li><a href="#" className="footer-link muted">Privacy Policy</a></li>
                                <li><a href="#" className="footer-link muted">Terms of Service</a></li>
                                <li><a href="#" className="footer-link muted">Contact Us</a></li>
                                <li><a href="#" className="footer-link muted">Documentation</a></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="footer-section-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 mb-5">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                                <h5 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Resources</h5>
                            </div>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="footer-link muted">About Ovarian Cancer</a></li>
                                <li><a href="#" className="footer-link muted">Research & Methodology</a></li>
                                <li><a href="#" className="footer-link muted">Dataset & Papers</a></li>
                                <li><a href="#" className="footer-link muted">Case Studies</a></li>
                                <li><a href="#" className="footer-link muted">FAQs</a></li>
                                <li><a href="#" className="footer-link muted">Support Center</a></li>
                            </ul>
                        </div>

                        {/* Connect & Newsletter */}
                        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="newsletter-card mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <h5 className="text-lg font-bold text-white">Stay Connected</h5>
                                </div>
                                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                                    Get research updates, new features, and case studies delivered to your inbox.
                                </p>

                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="flex-1 min-w-0 px-4 py-3 text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                            required
                                        />
                                        <button 
                                            type="submit"
                                            disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                                            className="w-full sm:w-auto sm:min-w-[140px] px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                                        >
                                            {newsletterStatus === 'loading' ? (
                                                <>
                                                    <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeLinecap="round" opacity="0.3" />
                                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round" />
                                                    </svg>
                                                    <span>Subscribing...</span>
                                                </>
                                            ) : newsletterStatus === 'success' ? (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    <span>Subscribed!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                    </svg>
                                                    <span>Subscribe</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {newsletterStatus === 'success' && (
                                        <p className="text-sm text-white/90 flex items-center gap-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Successfully subscribed!
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Social Media */}
                            <div className="footer-section-card">
                                <div className="flex items-center gap-2 mb-5">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                    <h5 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Follow Us</h5>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <a 
                                        aria-label="Facebook" 
                                        href="#" 
                                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 hover:shadow-lg"
                                        style={{ background: 'var(--color-primary-gradient)' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                                            <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.98 3.66 9.12 8.44 9.95v-7.05H8.08v-2.9h2.36V9.41c0-2.34 1.4-3.63 3.54-3.63. 1.03 0 2.1.18 2.1.18v2.31h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.9h-2.18v7.05C18.34 21.19 22 17.05 22 12.07z" />
                                        </svg>
                                    </a>
                                    <a 
                                        aria-label="Twitter" 
                                        href="#" 
                                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 hover:shadow-lg"
                                        style={{ background: 'var(--color-primary-gradient)' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                                            <path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.26-1.12 1.52-1.94-.68.4-1.43.69-2.23.85A3.49 3.49 0 0 0 11 8.7c0 .27.03.54.09.8C7.72 9.35 5 7.4 3.14 4.6c-.3.53-.47 1.15-.47 1.8 0 1.25.64 2.36 1.63 3.01-.6-.02-1.16-.18-1.66-.45v.05c0 1.72 1.22 3.15 2.84 3.48-.3.08-.62.12-.95.12-.23 0-.46-.02-.68-.06.46 1.44 1.8 2.48 3.39 2.51A6.99 6.99 0 0 1 2 19.54 9.85 9.85 0 0 0 7.29 21c6.75 0 10.45-5.6 10.45-10.45v-.48c.72-.52 1.34-1.16 1.83-1.9-.66.3-1.36.51-2.09.6z" />
                                        </svg>
                                    </a>
                                    <a 
                                        aria-label="LinkedIn" 
                                        href="#" 
                                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 hover:shadow-lg"
                                        style={{ background: 'var(--color-primary-gradient)' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                                            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4zM8.5 8.5h3.82v2.06h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.12V24H19v-8.67c0-2.06-.04-4.71-2.87-4.71-2.87 0-3.31 2.24-3.31 4.56V24H8.5z" />
                                        </svg>
                                    </a>
                                </div>

                                
                            </div>
                        </div>
                    </div>

                    {/* Gradient Divider */}
                    <div className="footer-gradient-divider"></div>

                    {/* Bottom Bar */}
                    <div className="pt-8 pb-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                                <span className="muted">© 2025 OvarianAID. All rights reserved.</span>
                                <div className="flex items-center gap-4">
                                    <a href="#" className="muted hover:text-primary transition-colors">Privacy</a>
                                    <span className="muted">•</span>
                                    <a href="#" className="muted hover:text-primary transition-colors">Terms</a>
                                    <span className="muted">•</span>
                                    <a href="#" className="muted hover:text-primary transition-colors">Cookies</a>
                                    <span className="muted">•</span>
                                    <a href="#" className="muted hover:text-primary transition-colors">Accessibility</a>
                                </div>
                            </div>
                            
                        </div>
                        <p className="text-xs muted text-center italic">
                            For research and diagnostic assistance only. Not intended for clinical diagnosis.
                        </p>
                    </div>
                    </div>
                </div>
            </footer>

         
        </>
    );
}
