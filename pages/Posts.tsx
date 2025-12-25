
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, FileEdit, Globe, Trash2, X, Sparkles, Clock, 
  Loader2, AlertCircle, Eye, Type, Save, Wand2, ArrowLeftRight, 
  CheckCircle2, FileText, User, Calendar, Check, Layers
} from 'lucide-react';
import { Post } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { updatePost, deletePost, createPost } from '../app/dashboard/posts/actions';
import { geminiService } from '../services/geminiService';

interface PostsProps {
  initialPosts: Post[];
  error?: string | null;
}

export const Posts: React.FC<PostsProps> = ({ initialPosts, error: initialError }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  
  // Modal & UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [pendingStatusPost, setPendingStatusPost] = useState<Post | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    published: false
  });
  const [originalContent, setOriginalContent] = useState('');

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                           p.content.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'published' && p.published) || 
                           (filterStatus === 'draft' && !p.published);
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, filterStatus]);

  const slugify = (text: string) => {
    let slug = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    let finalSlug = slug;
    let counter = 1;
    while (posts.some(p => p.slug === finalSlug && p.id !== selectedPost?.id)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    return finalSlug;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({ ...prev, title: newTitle, slug: slugify(newTitle) }));
  };

  const handleRewrite = async () => {
    if (!formData.content.trim()) return;
    setOriginalContent(formData.content);
    setIsRewriting(true);
    try {
      const rewritten = await geminiService.rewriteText(formData.content);
      setFormData(prev => ({ ...prev, content: rewritten }));
      setIsCompareMode(true);
    } catch (err) {
      setFormError('Failed to rewrite content with AI. Please try again later.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleStatusToggleRequest = (post: Post) => {
    setPendingStatusPost(post);
    setIsStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusPost) return;
    const post = pendingStatusPost;
    setIsToggling(post.id);
    const newStatus = !post.published;
    
    // Optimistic Update
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newStatus } : p));
    
    try {
      await updatePost(post.id, { published: newStatus });
    } catch (err) {
      // Revert on failure
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: post.published } : p));
      setError('Failed to update post status.');
    } finally {
      setIsToggling(null);
      setPendingStatusPost(null);
    }
  };

  const handleOpenModal = (post: Post | null) => {
    setSelectedPost(post);
    if (post) {
      setFormData({ title: post.title, slug: post.slug, content: post.content, published: post.published });
    } else {
      setFormData({ title: '', slug: '', content: '', published: false });
    }
    setIsPreviewMode(false);
    setIsCompareMode(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedPost) {
      try {
        await deletePost(selectedPost.id);
        setPosts(prev => prev.filter(p => p.id !== selectedPost.id));
        setSelectedPost(null);
      } catch (err) {
        setError('Failed to delete the post.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.title || !formData.content || !formData.slug) {
      setFormError('Title, slug, and content are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (selectedPost) {
        await updatePost(selectedPost.id, formData);
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, ...formData } : p));
      } else {
        const newPost: Post = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          author: 'Alex Rivera',
          created_at: new Date().toISOString()
        };
        await createPost(newPost);
        setPosts(prev => [newPost, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError('Failed to save post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-12 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border-2 border-dashed border-red-200 dark:border-red-800 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-red-900 dark:text-red-400 uppercase tracking-tight">Sync Error</h2>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black uppercase text-xs">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Content Library</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">Draft, publish, and manage your global knowledge base.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === status 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-indigo-200/50">
            <Plus size={18} /> New Article
          </button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by title, keywords or content snippet..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 dark:text-white shadow-sm transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[3rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => handleStatusToggleRequest(post)} 
                disabled={isToggling === post.id}
                className="transform transition-transform active:scale-95"
              >
                {isToggling === post.id ? (
                  <Loader2 className="animate-spin text-indigo-500" size={18} />
                ) : (
                  <div className="relative">
                    <StatusBadge status={post.published ? 'published' : 'draft'} type="post" />
                    {post.published && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                )}
              </button>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleOpenModal(post)} className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all border border-transparent hover:border-indigo-100"><FileEdit size={18} /></button>
                 <button onClick={() => { setSelectedPost(post); setIsDeleteModalOpen(true); }} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight uppercase line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{post.title}</h3>
            <div className="text-[10px] font-black text-indigo-500 mb-6 flex items-center gap-1.5 uppercase tracking-widest"><Globe size={14} /> /blog/{post.slug}</div>
            
            <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 mb-10 flex-1 leading-relaxed font-medium">{post.content}</p>
            
            <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={`https://picsum.photos/seed/${post.author}/64`} className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white dark:border-slate-700" alt={post.author} />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm border dark:border-slate-700">
                    <User size={10} className="text-indigo-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{post.author}</div>
                  <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
                    <Calendar size={10} /> {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button onClick={() => handleOpenModal(post)} className="p-3 bg-gray-50 dark:bg-slate-900 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all border border-gray-100 dark:border-slate-700 hover:shadow-lg">
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState 
              title="Knowledge Base Empty" 
              description="No articles found for your current search or status filter. Start fresh by drafting a new one." 
              icon={<Globe size={48} />} 
            />
          </div>
        )}
      </div>

      {/* Main Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-6xl h-full max-h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100"><FileEdit size={28} /></div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {selectedPost ? 'Edit Article' : 'Draft New Article'}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                    <Sparkles size={12} /> Gemini-Enhanced Workspace
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setIsPreviewMode(!isPreviewMode); setIsCompareMode(false); }} 
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-gray-500 border dark:border-slate-700'}`}
                >
                  {isPreviewMode ? 'Return to Editor' : 'Live Preview'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                  <X size={28} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800">
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {formError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-sm font-bold animate-in slide-in-from-top-4">
                    <AlertCircle size={20} className="shrink-0" />
                    {formError}
                  </div>
                )}
                
                {isPreviewMode ? (
                  <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-4">
                      <h1 className="text-6xl font-black uppercase tracking-tighter leading-none dark:text-white">{formData.title || 'Draft Article Title'}</h1>
                      <div className="flex items-center gap-4 text-xs font-black text-indigo-500 uppercase tracking-[0.2em] border-b pb-8 dark:border-slate-700">
                        <Globe size={14} /> /blog/{formData.slug || 'url-slug'}
                      </div>
                    </div>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-slate-300 text-xl font-medium">
                        {formData.content || 'Draft content will appear here...'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <Type size={14} /> Article Headline
                        </label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={handleTitleChange} 
                          className="w-full p-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[2rem] text-2xl font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-gray-300 transition-all" 
                          placeholder="What's the story about?" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <Globe size={14} /> URL Permalink
                        </label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-sm">/blog/</span>
                          <input 
                            type="text" 
                            value={formData.slug} 
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} 
                            className="w-full pl-20 pr-6 py-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[2rem] text-sm font-black text-indigo-600 dark:text-indigo-400 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                          <FileText size={14} /> Rich Markdown Body
                        </label>
                        <div className="flex gap-4">
                          {isCompareMode && (
                            <button 
                              type="button" 
                              onClick={() => setIsCompareMode(!isCompareMode)}
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:opacity-70 transition-all"
                            >
                              <ArrowLeftRight size={14} /> Hide Comparison
                            </button>
                          )}
                          <button 
                            type="button" 
                            onClick={handleRewrite} 
                            disabled={isRewriting || !formData.content}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:opacity-70 disabled:opacity-50 transition-all p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-4"
                          >
                            {isRewriting ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                            AI Enhance Text
                          </button>
                        </div>
                      </div>

                      {isCompareMode ? (
                        <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                          <div className="space-y-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Original Draft</div>
                            <div className="w-full p-8 bg-gray-100/50 dark:bg-slate-900/30 border border-dashed rounded-[2.5rem] text-sm text-gray-500 line-through min-h-[300px] whitespace-pre-wrap leading-relaxed">
                              {originalContent}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2 flex items-center gap-2">
                              <Sparkles size={12} /> Gemini Rewritten
                              <button onClick={() => setFormData(prev => ({...prev, content: originalContent}))} className="ml-auto text-gray-400 hover:text-red-600 text-[8px] font-black underline uppercase">Discard AI</button>
                            </div>
                            <textarea 
                              rows={15}
                              value={formData.content}
                              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full p-8 bg-emerald-50/20 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800 rounded-[2.5rem] text-lg leading-relaxed dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium custom-scrollbar"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <textarea 
                            rows={15} 
                            value={formData.content} 
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className={`w-full p-10 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[3rem] text-xl leading-relaxed dark:text-white outline-none transition-all placeholder:text-gray-300 focus:ring-4 focus:ring-indigo-500/10 font-medium custom-scrollbar ${isRewriting ? 'opacity-50 grayscale' : 'opacity-100'}`}
                            placeholder="Tell your story here..."
                          />
                          {isRewriting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-[3rem] backdrop-blur-[2px]">
                               <div className="flex flex-col items-center gap-4">
                                 <Loader2 className="animate-spin text-indigo-600" size={48} />
                                 <div className="font-black text-indigo-600 uppercase tracking-widest text-xs">AI is perfecting your prose...</div>
                               </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 p-8 bg-indigo-50/30 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-800 transition-all hover:bg-indigo-50/50">
                      <input 
                        type="checkbox" 
                        id="published" 
                        checked={formData.published}
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        className="w-8 h-8 rounded-xl border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="published" className="flex-1 cursor-pointer select-none">
                        <div className="text-lg font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-tight">Public Release Configuration</div>
                        <div className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-[0.2em] mt-1">If enabled, this content will be indexed and visible to all site visitors immediately.</div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t dark:border-slate-700 flex items-center justify-end gap-6 bg-gray-50/50 dark:bg-slate-900/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Discard Draft</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex items-center gap-4 px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-200/50 disabled:opacity-50 transition-all hover:-translate-y-1"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {selectedPost ? 'Commit Updates' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Archive Content?" 
        message="This article will be moved to the archival repository and hidden from all public indices. This action is logged for security." 
        confirmText="Confirm Archive" 
      />

      {/* Status Change Confirmation */}
      <ConfirmModal 
        isOpen={isStatusConfirmOpen} 
        onClose={() => { setIsStatusConfirmOpen(false); setPendingStatusPost(null); }} 
        onConfirm={handleConfirmStatusChange} 
        title={pendingStatusPost?.published ? "Unpublish Article?" : "Go Live Now?"} 
        message={pendingStatusPost?.published 
          ? "This will immediately hide the content from the public site. Existing SEO links may return a 404." 
          : "Your content will be made visible to all users globally. Ensure all drafts are final."} 
        confirmText={pendingStatusPost?.published ? "Unpublish" : "Go Live"}
        variant={pendingStatusPost?.published ? "danger" : "primary"}
      />
    </div>
  );
};
