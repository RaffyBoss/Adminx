
import React, { useState } from 'react';
import { MOCK_SERVICES } from '../constants';
import { Plus, Search, Edit2, Trash2, X, Filter, Loader2 } from 'lucide-react';
import { Service } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';

export const Services: React.FC = () => {
  // Fixed: Directly use MOCK_SERVICES since it's now correctly typed in constants.tsx
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filtered = services.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

  const toggleEnabled = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleDelete = () => {
    if (selectedService) {
      setServices(prev => prev.filter(s => s.id !== selectedService.id));
      setSelectedService(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Professional Services</h1>
          <p className="text-gray-500 dark:text-slate-400">Inventory of billable offerings and catalog items.</p>
        </div>
        <button 
          onClick={() => { setSelectedService(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Create Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter services by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price (USD)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{service.title}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[280px] mt-0.5">{service.description}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono font-bold text-gray-700 dark:text-slate-300">
                      ${service.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => toggleEnabled(service.id)}>
                      <StatusBadge status={service.enabled} type="boolean" />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right space-x-1">
                    <button 
                      onClick={() => { setSelectedService(service); setIsModalOpen(true); }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <EmptyState 
              title="No services found" 
              description="You haven't added any services yet or your search query yielded no results."
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold dark:text-white">{selectedService ? 'Edit Service' : 'Create New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg dark:text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Service Title</label>
                <input 
                  type="text" 
                  defaultValue={selectedService?.title} 
                  placeholder="e.g. Cloud Infrastructure Audit" 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    defaultValue={selectedService?.price} 
                    placeholder="0.00" 
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Detailed Description</label>
                <textarea 
                  rows={4} 
                  defaultValue={selectedService?.description} 
                  placeholder="Describe what's included in this service package..." 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <input 
                  type="checkbox" 
                  id="enabled" 
                  defaultChecked={selectedService?.enabled ?? true}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="enabled" className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  Visible in public catalog
                </label>
              </div>
            </form>
            <div className="p-6 border-t dark:border-slate-700 flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
                {selectedService ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Service?"
        message="This action is permanent. Any recurring billing associated with this service ID will need to be manually resolved."
        confirmText="Yes, delete it"
      />
    </div>
  );
};
