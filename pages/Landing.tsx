
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Rocket, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">AdminX</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Login</Link>
          <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-8 animate-pulse">
          <Zap size={16} />
          <span>New: Gemini-Powered AI Assistant</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
          Manage your enterprise <br />
          <span className="text-indigo-600">with precision.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          The all-in-one admin dashboard designed for modern teams. Secure, fast, and enhanced with the latest Google Gemini AI capabilities.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-24">
          <Link to="/dashboard" className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl">
            Go to Dashboard
          </Link>
          <Link to="/login" className="w-full md:w-auto px-10 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            Contact Support
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: <ShieldCheck size={32} className="text-indigo-600" />, title: 'Role-Based Access', desc: 'Secure your data with granular permissions for viewers, editors, and admins.' },
            { icon: <Rocket size={32} className="text-indigo-600" />, title: 'Real-time Insights', desc: 'Monitor leads, services, and posts as they happen with interactive charts.' },
            { icon: <CheckCircle size={32} className="text-indigo-600" />, title: 'Gemini Integration', desc: 'Let AI summarize your leads and rewrite your marketing copy instantly.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 py-12 text-center">
        <p className="text-slate-500 text-sm">© 2024 AdminX Enterprises. Built with Gemini Pro.</p>
      </footer>
    </div>
  );
};
