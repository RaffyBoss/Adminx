
import React, { useState } from 'react';
import { Sparkles, Wand2, FileSearch, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const AIHelperPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'rewrite' | 'summarize' | 'service' | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      let res = '';
      if (activeTool === 'rewrite') res = await geminiService.rewriteText(input);
      if (activeTool === 'summarize') res = await geminiService.summarizeLead(input);
      if (activeTool === 'service') res = await geminiService.generateServiceDescription(input);
      setOutput(res);
    } catch (err) {
      setOutput('Failed to generate AI response. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce hover:animate-none"
      >
        <Sparkles size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="w-full max-w-md bg-white dark:bg-slate-800 h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-indigo-500" size={20} />
                <h2 className="text-xl font-bold dark:text-white">AdminX AI Helper</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg dark:text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'rewrite', icon: <Wand2 size={18} />, label: 'Rewrite' },
                  { id: 'summarize', icon: <FileSearch size={18} />, label: 'Lead' },
                  { id: 'service', icon: <MessageSquare size={18} />, label: 'Service' },
                ].map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id as any);
                      setOutput('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-2 transition-all ${
                      activeTool === tool.id 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-300' 
                      : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tool.icon}
                    {tool.label}
                  </button>
                ))}
              </div>

              {activeTool && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-slate-300">
                      {activeTool === 'rewrite' ? 'Enter text to rewrite' : 
                       activeTool === 'summarize' ? 'Enter lead details' : 
                       'Enter service name'}
                    </label>
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type something here..."
                      className="w-full h-32 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>

                  <button 
                    onClick={handleAction}
                    disabled={isLoading || !input}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Generate with Gemini
                  </button>

                  {output && (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-2">AI Response</div>
                      <div className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed italic">
                        "{output}"
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!activeTool && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50">
                  <Sparkles size={48} className="mb-4 text-indigo-300" />
                  <p className="text-gray-500 dark:text-slate-400">Select a tool to get started with AI automation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
