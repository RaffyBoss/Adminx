
import React from 'react';
import { StatCard } from '../components/StatCard';
import { Users, FileText, Briefcase, DollarSign, Plus, ArrowRight, Zap, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', leads: 12, rev: 1200 },
  { name: 'Tue', leads: 18, rev: 2398 },
  { name: 'Wed', leads: 45, rev: 5800 },
  { name: 'Thu', leads: 27, rev: 3908 },
  { name: 'Fri', leads: 32, rev: 4800 },
  { name: 'Sat', leads: 15, rev: 1800 },
  { name: 'Sun', leads: 24, rev: 3300 },
];

export const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Executive Summary</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Real-time performance metrics for Phase 3 rollout.</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg">7 Days</button>
            <button className="px-4 py-2 text-gray-500 dark:text-slate-400 text-xs font-black hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-all">30 Days</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Pipeline Leads" value="1,492" trend={18} color="text-indigo-600" icon={<Users />} />
        <StatCard label="Estimated Rev" value="$128,400" trend={14.2} color="text-green-600" icon={<DollarSign />} />
        <StatCard label="Live Articles" value="156" trend={-1.5} color="text-orange-600" icon={<FileText />} />
        <StatCard label="Active Services" value="24" trend={5} color="text-blue-600" icon={<Briefcase />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Growth Velocity</h3>
              <p className="text-xs text-gray-400 mt-1 font-bold">New leads vs Forecasted targets</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
           <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-black mb-2">Q1 Revenue Target</h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-8">You are currently at 84% of your quarterly goal. Secure 4 more high-ticket leads to hit 100%.</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Progress</span>
                   <span className="text-3xl font-black">84%</span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                  View Sales Roadmap <ArrowRight size={18} />
                </button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black dark:text-white">Active Services</h3>
              <button className="text-indigo-600 text-xs font-black uppercase hover:underline">Manage All</button>
            </div>
            <div className="space-y-4">
              {['Enterprise Audit', 'SaaS Onboarding', 'Cloud Migration'].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border dark:border-slate-700 shadow-sm">
                      <Zap size={18} className="text-indigo-500" />
                    </div>
                    <span className="font-bold text-sm dark:text-white">{s}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black dark:text-white">Recent Posts</h3>
              <button className="text-indigo-600 text-xs font-black uppercase hover:underline">Draft New</button>
            </div>
            <div className="space-y-4">
              {['Q1 Security Report', 'Modern UI Principles', 'Scale with AdminX'].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border dark:border-slate-700 shadow-sm">
                      <FileText size={18} className="text-orange-500" />
                    </div>
                    <span className="font-bold text-sm dark:text-white">{p}</span>
                  </div>
                   <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg">LIVE</div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};
