
import React, { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Save, ShieldCheck, 
  Github, Layers, Link as LinkIcon, RefreshCw, 
  Check, AlertCircle, Loader2, ChevronRight
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);

  const TABS = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Layers size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  ];

  const handleConnectGithub = () => {
    setIsConnectingGithub(true);
    setTimeout(() => {
      setIsConnectingGithub(false);
      setIsGithubConnected(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">System Configuration</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Manage your personal workspace and external service nodes.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-100">
          <Save size={18} /> Save Preferences
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <aside className="w-full md:w-64 bg-gray-50/50 dark:bg-slate-900/50 border-r dark:border-slate-700 p-6">
          <nav className="space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/5 border dark:border-slate-700' 
                  : 'text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-indigo-600' : ''}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-10">
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50">
                <div className="relative">
                  <img src="https://picsum.photos/seed/admin/200" className="w-28 h-28 rounded-[2rem] object-cover ring-8 ring-white dark:ring-slate-800 shadow-2xl" alt="Profile" />
                  <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                    <Palette size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Alex Rivera</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-4">Enterprise Owner • Identity Verified</p>
                  <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border dark:border-slate-700 shadow-sm">Change Identity</button>
                    <button className="px-5 py-2.5 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">Wipe Data</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Public Display Name</label>
                  <input type="text" defaultValue="Alex Rivera" className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Verified Email</label>
                  <input type="email" defaultValue="alex@adminx.com" className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tight mb-2">Service Connectors</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">Bridge your AdminX content with third-party development and marketing platforms.</p>
              </div>

              <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group border border-indigo-500/20">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Github size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Github size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight">GitHub Integration</h4>
                      <p className="text-xs text-indigo-300 font-black uppercase tracking-widest">Repository Sync & CI/CD</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                    Automate your content pipeline. Push Gemini-rewritten blog posts and service updates directly to your production repository as Markdown files.
                  </p>

                  {isGithubConnected ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                        <div className="p-2 bg-emerald-500 rounded-lg text-white">
                          <Check size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black uppercase text-emerald-400">Connected Account</div>
                          <div className="text-sm font-bold uppercase tracking-tight">alex-rivera-dev / production-cms</div>
                        </div>
                        <button onClick={() => setIsGithubConnected(false)} className="text-[10px] font-black uppercase text-gray-500 hover:text-red-400">Disconnect</button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Sync Path</div>
                          <div className="text-xs font-bold text-gray-300">/content/posts/*.md</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Auto-Push</div>
                          <div className="text-xs font-bold text-emerald-400">ENABLED</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick