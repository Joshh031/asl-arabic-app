'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslApp() {
  // Defensive initialization: ensure roots is always an array
  const [roots, setRoots] = useState(Array.isArray(initialRoots) ? initialRoots : []);
  const [selectedRoot, setSelectedRoot] = useState(Array.isArray(initialRoots) ? initialRoots[0] : null);
  const [quizMode, setQuizMode] = useState(false);

  // Prevent crash if data hasn't loaded or is malformed
  if (!selectedRoot || !roots.length) {
    return <div className="p-20 text-center font-sans text-slate-400">Initializing Root Engine...</div>;
  }

  const masteredCount = roots.filter((r: any) => r.mastered).length;
  const retentionRate = roots.length > 0 ? Math.round((masteredCount / roots.length) * 100) : 0;

  const handleMastered = (rootId: string) => {
    const updated = roots.map((r: any) => 
      r.root === rootId ? { ...r, mastered: true } : r
    );
    setRoots(updated);
    // Auto-select the next root if possible to keep the flow moving
    if (rootId === selectedRoot.root) {
        setSelectedRoot(updated.find(r => r.root === rootId));
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 text-slate-900 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">ASL <span className="text-blue-600">أصل</span></h1>
          <div className="flex gap-4 mt-4">
             <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Retention</p>
                <p className="text-2xl font-mono font-bold text-blue-700">{retentionRate}%</p>
             </div>
             <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery</p>
                <p className="text-2xl font-mono font-bold text-slate-700">{masteredCount}/{roots.length}</p>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setQuizMode(!quizMode)}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
        >
          {quizMode ? "Close Quiz" : "Start Pulse"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {quizMode ? (
          <div className="lg:col-span-12 bg-white p-12 rounded-[3rem] shadow-xl border border-blue-50 text-center">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Identify the Root</h2>
            <div className="text-9xl font-arabic mb-12 py-10 text-slate-800">{selectedRoot.arabic}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {roots.map((r: any) => (
                <button 
                  key={r.root}
                  onClick={() => r.root === selectedRoot.root ? handleMastered(r.root) : alert("Focus on the root pattern.")}
                  className="p-6 bg-slate-50 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all border border-slate-100"
                >
                  {r.meaning}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="lg:col-span-4 space-y-3">
              {roots.map((r: any) => (
                <button
                  key={r.root}
                  onClick={() => setSelectedRoot(r)}
                  className={`w-full text-left p-6 rounded-2xl transition-all border-2 ${
                    selectedRoot.root === r.root ? 'border-blue-500 bg-white shadow-lg' : 'border-transparent opacity-40 grayscale hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-arabic">{r.arabic}</span>
                    {r.mastered && <span className="text-green-500 text-[10px] font-black tracking-widest uppercase">✓ MASTERED</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-8 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-start mb-12">
                  <div className="text-9xl font-arabic leading-none text-slate-900">{selectedRoot.arabic}</div>
                  <button 
                    onClick={() => handleMastered(selectedRoot.root)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedRoot.mastered ? 'bg-green-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    {selectedRoot.mastered ? "Mastered" : "Mark Mastered"}
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedRoot.family?.map((f: any) => (
                    <div key={f.word} className="p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-100 transition-all">
                       <div className="text-4xl font-arabic mb-4 text-slate-800">{f.script}</div>
                       <p className="font-bold text-slate-900 text-lg">{f.word}</p>
                       <p className="text-sm text-slate-400 font-medium uppercase tracking-tighter mt-1">{f.meaning}</p>
                    </div>
                  ))}
               </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}