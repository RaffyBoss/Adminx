
import React, { Suspense } from 'react';
import { ServicesClient } from './ServicesClient';
import { MOCK_SERVICES } from '../../../constants';

/**
 * Server Component for the Services page.
 * Fetches data server-side and uses Suspense for loading states.
 */
async function fetchServices() {
  // Simulate a real Supabase fetch delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app:
  // const supabase = await createServerClient();
  // const { data } = await supabase.from('services').select('*');
  // return data;

  return MOCK_SERVICES;
}

function ServicesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-4 w-96 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-12 w-40 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 h-[500px] p-6 space-y-4">
        <div className="h-10 w-full bg-gray-50 dark:bg-slate-900 rounded-xl"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-12 w-full bg-gray-50 dark:bg-slate-900 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesClient initialServices={services} />
    </Suspense>
  );
}
