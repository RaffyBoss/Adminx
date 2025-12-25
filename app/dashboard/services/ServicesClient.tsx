
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Filter, Loader2, Sparkles, Wand2, Briefcase } from 'lucide-react';
import { Service } from '../../../types';
import { StatusBadge } from '../../../components/StatusBadge';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { EmptyState } from '../../../components/EmptyState';
import { updateService, deleteService } from './actions';
import { geminiService } from '../../../services/geminiService';

interface ServicesClientProps {
  initialServices: Service[];
}

export const ServicesClient: React.FC<ServicesClientProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Modal Form State
  const [formValues, setFormValues] = useState({
    title: '',
    price: '',
    description: '',
    enabled: true
  });

  const filtered = services.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

  const handleOpenModal = (service: Service | null) => {
    setSelectedService(service);
    if (service) {
      setFormValues({
        title: service.title,
        price: service.price.toString(),
        description: service.description,
        enabled: service.enabled
      });
    } else {
      setFormValues({ title: '', price: '', description: '', enabled: true });
    }
    setIsModalOpen(true);
  };

  const handleAiDescription = async () => {
    if (!formValues.title.trim()) {
      alert("Please enter a service title first so AI can generate a relevant description.");
      return;
    }
    setIsAiGenerating(true);
    try {
      const aiDesc = await geminiService.generateServiceDescription(formValues.title);
      setFormValues(prev => ({ ...prev, description: aiDesc }));
    } catch (err) {
      alert("AI was unable to generate a description. Please try manually.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleToggleEnabled = async (id: string, currentStatus: boolean) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !currentStatus } : s));
    try {
      await updateService(id, { enabled: !currentStatus });
    } catch (err) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: currentStatus } : s));
      alert('Failed to update service status.');
    }
  };

  const handleDelete = async () => {
    if (selectedService) {
      setIsSubmitting(true);
      try {
        await deleteService(selectedService.id);
        setServices(prev => prev.filter(s => s.id !== selectedService.id));
        setSelectedService(null);
      } catch (err) {
        alert('Failed to delete service.');
      } finally {
        setIsSubmitting(false);
        setIsDeleteModalOpen(false);
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      title: formValues.title,
      price: Number(formValues.price),
      description: formValues.description,
      enabled: formValues.enabled,
    };

    try {
      if (selectedService) {
        await updateService(selectedService.id, data);
        setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, ...data } : s));
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Catalog Management</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">Configure billable enterprise service offerings.</p>
        </div>
        <button 
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-indigo-100"
        >
          <Plus size={20} /> New Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm outline-none dark:text-white transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Model</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{service.title}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[320px] mt-1 italic">"{service.description}"</div>
                  </td>
                  <td className="px-8 py-6 font-mono font-black text-slate-700 dark:text-slate-300">
                    ${service.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => handleToggleEnabled(service.id, service.enabled)}>
                      <StatusBadge status={service.enabled} type="boolean" />
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right space-x-1">
                    <button onClick={() => handleOpenModal(service)} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }} className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12">
              <EmptyState title="No services found" description="You haven't added any billable services yet." icon={<Briefcase size={48} />} />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{selectedService ? 'Update Service' : 'Provision Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl dark:text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmitForm} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Designation</label>
                <input 
                  value={formValues.title}
                  onChange={(e) => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="e.g. Cloud Management SLA" 
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-black tracking-tight" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Value (USD)</label>
                <input 
                  type="number"
                  value={formValues.price}
                  onChange={(e) => setFormValues(prev => ({ ...prev, price: e.target.value }))}
                  required
                  placeholder="0.00" 
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-mono font-bold" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Catalog Description</label>
                  <button 
                    type="button" 
                    onClick={handleAiDescription}
                    disabled={isAiGenerating}
                    className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:opacity-70 disabled:opacity-50"
                  >
                    {isAiGenerating ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />}
                    AI Generate
                  </button>
                </div>
                <textarea 
                  rows={4} 
                  value={formValues.description}
                  onChange={(e) => setFormValues(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Describe your service..." 
                  className="w-full p-5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium italic leading-relaxed" 
                />
              </div>
              <div className="flex items-center gap-4 p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                <input 
                  type="checkbox" 
                  id="enabled" 
                  checked={formValues.enabled}
                  onChange={(e) => setFormValues(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-6 h-6 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="enabled" className="text-xs font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
                  Visible in Public Feed
                </label>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-200/50 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : (selectedService ? 'Commit Update' : 'Initialize Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Deprovision Service?"
        message="This will immediately remove the offering from the live storefront."
        confirmText={isSubmitting ? "Processing..." : "Confirm Removal"}
      />
    </div>
  );
};
