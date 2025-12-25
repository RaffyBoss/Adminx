
import React, { useState, useMemo } from 'react';
import { MOCK_LEADS, MOCK_USER } from '../constants';
import { Mail, MessageCircle, X, CheckCircle2, ArrowRight, Search, Globe, User, Check, Sparkles, Loader2, FileSearch, ShieldAlert } from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { canViewLeads } from '../lib/auth/roles';
import { geminiService } from '../services/geminiService';

export const Leads: React.FC = () => {
  const user = MOCK_USER;
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  
  // AI State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleSummarize = async (lead: Lead) => {
    setIsAiLoading(true);
    setAiSummary(null);
    try {
      const context = `Name: ${lead.name}, Email: ${lead.email}, Source: ${lead.source}, Message: ${lead.message}`;
      const summary = await geminiService.summarizeLead(context);
      setAiSummary(summary);
    } catch (err) {
      setAiSummary("AI was unable to process this lead at the moment. Please check your network connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const updateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Lead marked as ${newStatus}`);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = 
        l.name.toLowerCase().includes(search.toLowerCase()) || 
        l.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  if (!canViewLeads(user.role)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-red-100 dark:border-red-900/20 shadow-xl shadow-red-500/5">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100 dark:shadow-none">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Unauthorized Access</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium leading-relaxed">
          The Leads module contains sensitive business information. Your current role (<span className="text-indigo-600 font-black uppercase">{user.role}</span>) does not permit viewing pipeline data.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-160px)] gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Leads Inbox</h1>
            <div className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl border border-gray-200 dark:border-slate-700">
              {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all capitalize ${
                    statusFilter === status 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50' 
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-700">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={() => { setSelectedLead(lead); setAiSummary(null); }}
              className={`p-6 cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-900/5 transition-all border-l-4 ${
                selectedLead?.id === lead.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-600' : 'border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900 dark:text-white">{lead.name}</span>
                  <StatusBadge status={lead.status} type="lead" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold mb-2 text-gray-400">
                <div className="flex items-center gap-1"><Mail size={12} /> {lead.email}</div>
                <div className="text-indigo-500 flex items-center gap-1.5"><Globe size={10} /> {lead.source}</div>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1 italic pr-4 italic">"{lead.message}"</p>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="p-10">
              <EmptyState 
                title="No leads found" 
                description="Your inbox is clear! Try adjusting filters if you're looking for something specific." 
                icon={<FileSearch size={40} />}
              />
            </div>
          )}
        </div>
      </div>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[540px] bg-white dark:bg-slate-800 shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] z-[80] transition-transform duration-500 ease-out transform ${
          selectedLead ? 'translate-x-0' : 'translate-x-full'
        } border-l border-gray-200 dark:border-slate-700 flex flex-col`}
      >
        {selectedLead && (
          <>
            <div className="p-8 border-b dark:border-slate-700 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.25rem] bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl">
                  {selectedLead.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-tight tracking-tight uppercase">{selectedLead.name}</h2>
                  <div className="text-xs font-bold text-white/70 uppercase tracking-widest">{selectedLead.source}</div>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/10 rounded-2xl transition-all"><X size={28} /></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto space-y-10 custom-scrollbar pb-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Original Inquiry</h3>
                  <button 
                    onClick={() => handleSummarize(selectedLead)}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    Get AI Summary
                  </button>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-700/50 italic text-gray-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
                  "{selectedLead.message}"
                </div>

                {/* AI Summary Output */}
                {(isAiLoading || aiSummary) && (
                  <div className="animate-in slide-in-from-top-4 duration-500">
                    <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                      <Sparkles className="absolute top-4 right-4 text-white/10" size={64} />
                      <div className="relative z-10 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Gemini Intelligence Analysis</div>
                        {isAiLoading ? (
                          <div className="flex items-center gap-3 py-4">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-bold">Distilling lead data...</span>
                          </div>
                        ) : (
                          <div className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                            {aiSummary}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Contact Details</h3>
                <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-3xl">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-gray-400 uppercase">Registered Email</div>
                    <div className="text-sm font-bold dark:text-white truncate">{selectedLead.email}</div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Pipeline Stage</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'new', label: 'Reset to New', icon: <User size={16} />, color: 'bg-indigo-600' },
                    { id: 'contacted', label: 'Mark as Contacted', icon: <MessageCircle size={16} />, color: 'bg-sky-600' },
                    { id: 'closed', label: 'Close Account', icon: <CheckCircle2 size={16} />, color: 'bg-emerald-600' },
                  ].map((btn) => (
                    <button 
                      key={btn.id}
                      onClick={() => updateStatus(selectedLead.id, btn.id as LeadStatus)}
                      className={`flex items-center justify-between p-5 rounded-[1.75rem] border-2 transition-all group ${
                        selectedLead.status === btn.id 
                        ? `${btn.color} border-transparent text-white shadow-xl translate-x-1` 
                        : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selectedLead.status === btn.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-slate-800'}`}>
                          {btn.icon}
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">{btn.label}</span>
                      </div>
                      {selectedLead.status === btn.id && <Check size={20} />}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-8 border-t dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
              <button className="w-full py-5 bg-slate-900 dark:bg-indigo-600 hover:opacity-90 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-2xl">
                Open Full Response Panel <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] transition-opacity animate-in fade-in" onClick={() => setSelectedLead(null)} />
      )}

      {toast.visible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl border border-white/10">
            <Check className="text-emerald-500" size={20} />
            <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
