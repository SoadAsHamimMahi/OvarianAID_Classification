import React from "react";
import "./App.css";
import ImageClassifier from "./components/ImageClassifier";
import Footer from "./components/Footer";
import Header from "./components/Header";
import heroImage from "./assets/6170016543194942672.jpg";

export default function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header></Header>
      
      <div className="flex-1 flex flex-col items-center py-8 px-4 md:py-12 md:px-6 lg:px-8">
        <div className="w-full max-w-[90%] space-y-10 md:space-y-12">
          {/* Hero Section */}
          <section className="hero card p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="w-full min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft mb-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Clinical Decision Support</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  <span className="block text-gray-900 mb-1">Transform Histology Analysis</span>
                  <span className="block text-primary">
                    AI-Powered Classification
                  </span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                  Get instant, accurate predictions directly in your browser. Advanced machine learning meets clinical precision for faster, more reliable diagnostic workflows.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>100% Private</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Research-Grade</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Decision-support tool only — does not replace professional medical judgment.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <img 
                    src={heroImage} 
                    alt="Histology image showing Mucinous classification with 88.0% confidence - OvarianAID AI analysis result" 
                    className="w-full max-w-sm rounded-lg object-cover shadow-md border border-gray-200" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card p-5 md:p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                  <line x1="12" y1="7" x2="7" y2="12" />
                  <line x1="12" y1="7" x2="17" y2="12" />
                  <line x1="12" y1="17" x2="7" y2="12" />
                  <line x1="12" y1="17" x2="17" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Advanced AI Models</h3>
              <p className="text-sm text-gray-600 leading-relaxed">State-of-the-art deep learning algorithms trained on extensive histology datasets for maximum accuracy.</p>
            </div>
            <div className="card p-5 md:p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 10v4" />
                  <path d="M12 14h.01" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Privacy First</h3>
              <p className="text-sm text-gray-600 leading-relaxed">All processing happens in your browser. Your images never leave your device, ensuring complete data privacy.</p>
            </div>
            <div className="card p-5 md:p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Instant Results</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Get classification results in seconds, not hours. Streamline your diagnostic workflow with real-time analysis.</p>
            </div>
          </div>

          {/* Main Classifier */}
          <main className="card card-elevated p-6 md:p-8 lg:p-10 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <ImageClassifier
              cloudModelUrl="https://teachablemachine.withgoogle.com/models/-AeufB8Wz/model.json"
              metadataUrl="https://teachablemachine.withgoogle.com/models/-AeufB8Wz/metadata.json"
            />
          </main>

          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
