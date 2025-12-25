
import React from 'react';
import { Leads } from '../../../pages/Leads.tsx';
import { MOCK_USER } from '../../../constants.tsx';
import { canViewLeads } from '../../../lib/auth/roles.ts';

export default function LeadsPage() {
  // In real Next.js, this check would happen in a Server Component
  const user = MOCK_USER; 
  
  if (!canViewLeads(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200">
        <h2 className="text-2xl font-black text-red-600 mb-2">Unauthorized</h2>
        <p className="text-red-500">You do not have permission to view business leads.</p>
      </div>
    );
  }

  return <Leads />;
}
