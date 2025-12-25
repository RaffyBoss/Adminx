
import React, { useState } from 'react';
import { User, ShieldAlert, UserPlus, MoreHorizontal, ShieldCheck, Mail, ShieldInfo } from 'lucide-react';
import { UserRole } from '../types';

const INITIAL_USERS: any[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@adminx.com', role: 'owner', avatar: 'https://picsum.photos/seed/1/200' },
  { id: '2', name: 'Jordan Smith', email: 'jordan@adminx.com', role: 'admin', avatar: 'https://picsum.photos/seed/2/200' },
  { id: '3', name: 'Casey Lee', email: 'casey@adminx.com', role: 'editor', avatar: 'https://picsum.photos/seed/3/200' },
  { id: '4', name: 'Riley Vance', email: 'riley@adminx.com', role: 'viewer', avatar: 'https://picsum.photos/seed/4/200' },
];

export const Users: React.FC = () => {
  const [users, setUsers] = useState(INITIAL_USERS);

  const updateRole = (id: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-slate-400">Control who has access to the AdminX ecosystem.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-xl">
          <UserPlus size={20} /> Invite User
        </button>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4 text-amber-800 dark:text-amber-400">
        <ShieldAlert size={24} className="flex-shrink-0" />
        <p className="text-sm font-medium italic">
          <strong>Security Tip:</strong> Regularly review user permissions. Access to the Leads and Users modules should be strictly limited to trusted staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${
              user.role === 'owner' ? 'bg-indigo-600' : 
              user.role === 'admin' ? 'bg-red-500' :
              user.role === 'editor' ? 'bg-orange-500' : 'bg-gray-400'
            }`}></div>
            
            <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100">
              <MoreHorizontal size={20} />
            </button>

            <img src={user.avatar} className="w-20 h-20 rounded-full mb-4 border-4 border-gray-50 dark:border-slate-700 shadow-md" alt={user.name} />
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{user.name}</h3>
            <div className="text-sm text-gray-500 dark:text-slate-400 mb-6 flex items-center gap-1 justify-center">
              <Mail size={12} /> {user.email}
            </div>

            <div className="w-full space-y-3">
              <div className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-left mb-1">Assigned Role</div>
              <select 
                value={user.role}
                onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-none transition-all ${
                  user.role === 'owner' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-400' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 w-full grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Posts</span>
                <span className="text-sm font-bold text-gray-700 dark:text-slate-300">12</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</span>
                <span className="text-sm font-bold text-green-600">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
