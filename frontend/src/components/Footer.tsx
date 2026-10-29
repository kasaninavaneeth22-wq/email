import React from 'react';
import { Shield, Lock, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060911] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-100 tracking-tight">CyberShield Email Defense</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An intelligent, explainable email threat analysis platform combining trained machine learning models 
              with deterministic cybersecurity heuristic rules to protect users against spam, credential theft, and targeted phishing campaigns.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> Client-Side Privacy Guaranteed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Award className="w-3.5 h-3.5" /> Academic Capstone Project
              </span>
            </div>
          </div>

          {/* Column 2: System Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Application</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Overview</Link></li>
              <li><Link to="/analyzer" className="hover:text-indigo-400 transition-colors">Threat Scanner</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Security Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-indigo-400 transition-colors">Analysis History</Link></li>
            </ul>
          </div>

          {/* Column 3: Security & Academic */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/security" className="hover:text-indigo-400 transition-colors">Security Guidelines</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About & Team</Link></li>
              <li><a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">API Docs (Swagger)</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Email Spam and Phishing Detection System. Built for academic viva and demonstration.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React, FastAPI & Scikit-Learn
          </p>
        </div>
      </div>
    </footer>
  );
};
