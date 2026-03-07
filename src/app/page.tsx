'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';
export const dynamic = 'force-dynamic';
export default function AslApp() {
  const [roots, setRoots] = useState(initialRoots);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, total: initialRoots.length });

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleMastered = (rootId: string) => {
    // Save progress to local storage for "persistent tracking"
    const updated = roots.map(r => r.root === rootId ? { ...r, mastered: true } : r);
    setRoots(updated);
    setStats({ ...stats, mastered: updated.filter(r => r.mastered).length });
    alert("Root Mastered! Compounding your knowledge...");
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 text-slate-900">
      {/* Metrics Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">ASL <span className="text-blue-600">أصل</span></h1>
          <div className="flex gap-4 mt-2">
             <div className="bg-blue-50 px-3 py-1 rounded-md">
                <p className="text-[10px] font-bold text-blue-400 uppercase">Retention Rate</p>
                <p className="text-xl font-mono font-bold text-blue-700">{Math.round((stats.mastered / stats.total) * 100)}%</p>
             </div>
             <div className="bg-slate-50 px-3 py-1 rounded-md">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Roots Known</p>
                <p className="text-xl font-mono font-bold text-slate-700">{stats.mastered}/{stats.total}</p>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setQuizMode(!quizMode)}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
        >
          {quizMode ? "Exit Quiz" : "Start Pulse Quiz"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {quizMode ? (
          /* QUIZ INTERFACE */
          <div className="lg:col-span-12 bg-white p-20 rounded-[3rem] shadow-xl text-center border border-blue-50">
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-8">Identify the Root</h2>
            <div className="text-9xl font-arabic mb-12">{selectedRoot.arabic}</div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {roots.map(r => (
                <button 
                  key={r.root}
                  onClick={() => r.root === selectedRoot.root ? handleMastered(r.root) : alert("Try again")}
                  className="p-6 bg-slate-50 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  {r.meaning}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* EXPLORER INTERFACE (Same as before but with 'Mastered' button) */
          <>
            <div className="lg:col-span-4 space-y-3">
              {roots.map((r) => (
                <button
                  key={r.root}
                  onClick={() => setSelectedRoot(r)}
                  className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${
                    selectedRoot.root === r.root ? 'border-blue-500 bg-white shadow-md' : 'border-transparent opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-arabic">{r.arabic}</span>
                    {r.mastered && <span className="text-green-500 text-xs font-bold">● MASTERED</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-8 bg-white p-12 rounded-[2.5rem] border border-slate-100">
               <div className="flex justify-between items-start mb-10">
                  <div className="text-8xl font-arabic">{selectedRoot.arabic}</div>
                  <button 
                    onClick={() => handleMastered(selectedRoot.root)}
                    className="bg-green-100 text-green-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-200"
                  >
                    Mark as Mastered
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  {selectedRoot.family.map(f => (
                    <div key={f.word} className="p-6 bg-slate-50 rounded-2xl">
                       <div className="text-3xl font-arabic mb-2">{f.script}</div>
                       <p className="font-bold text-slate-800">{f.word}</p>
                       <p className="text-sm text-slate-500">{f.meaning}</p>
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