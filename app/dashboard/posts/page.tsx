
import React, { Suspense } from 'react';
import { Posts } from '../../../pages/Posts.tsx';
import { MOCK_POSTS } from '../../../constants.tsx';
import { Post } from '../../../types.ts';

async function getPosts(): Promise<{ data: Post[], error: string | null }> {
  try {
    // Simulated fetch delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Logic for demo (90% success rate)
    if (Math.random() < 0.05) throw new Error("Connection failed");
    
    return { data: MOCK_POSTS, error: null };
  } catch (err) {
    return { data: [], error: "Could not retrieve content library from the database." };
  }
}

function PostsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-9 w-64 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-4 w-96 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-14 w-44 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[2.5rem] p-7 space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-20 bg-gray-100 dark:bg-slate-700 rounded-full"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-50 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-50 dark:bg-slate-700 rounded-lg"></div>
              </div>
            </div>
            <div className="h-7 w-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 w-1/2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"></div>
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-gray-50 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-3 w-5/6 bg-gray-50 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-3 w-4/6 bg-gray-50 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PostsPage() {
  const { data, error } = await getPosts();

  return (
    <Suspense fallback={<PostsSkeleton />}>
      <Posts initialPosts={data} error={error} />
    </Suspense>
  );
}
