'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslApp() {
  const [roots, setRoots] = useState(initialRoots);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleMastered = (rootId: string) => {
    const updated = roots.map((r: any) => 
      r.root === rootId ? { ...r, mastered: true } : r
    );
    setRoots(updated);
  };

  const filteredRoots = roots.filter((r: any) => r.level === currentLevel);
  const masteredCount = roots.filter((r: any) => r.mastered).length;

  return (
    <main className="min-h-screen bg-[#0A0A0B] p-6 lg:p-12 text-slate-300 font-sans selection:bg-blue-500/30">
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            ASL <span className="text-blue-500 text-normal">أصل</span>
          </h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button 
                key={lvl} 
                onClick={() => setCurrentLevel(lvl)}
                className={`px-3 py-1 rounded-md text-[10px] font-black transition-all border ${
                  currentLevel === lvl ? 'bg-blue-600 border-blue-400 text-white' : 'bg-transparent border-white/10 text-slate-500'
                }`}
              >
                LVL {lvl}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setQuizMode(!quizMode)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
          {quizMode ? "Exit Pulse" : "Initialize Pulse"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {quizMode ? (
          <div className="lg:col-span-12 bg-[#111114] border border-white/5 p-20 rounded-[3rem] text-center">
            <div className="text-9xl font-arabic text-blue-500 mb-12">{selectedRoot.arabic}</div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {filteredRoots.map((r: any) => (
                <button key={r.root} onClick={() => r.root === selectedRoot.root ? handleMastered(r.root) : null} className="p-6 bg-white/5 border border-white/5 rounded-2xl font-bold hover:bg-blue-600 transition-all text-white">
                  {r.meaning}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="lg:col-span-4 space-y-4">
              {filteredRoots.map((r: any) => (
                <button key={r.root} onClick={() => setSelectedRoot(r)} className={`w-full text-left p-6 rounded-2xl transition-all border-2 ${selectedRoot.root === r.root ? 'border-blue-600 bg-[#16161A] shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-arabic text-white">{r.arabic}</span>
                    {r.mastered && <span className="text-blue-400 text-[10px] font-black">STABLE</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#111114] p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-9xl font-arabic text-white leading-none">{selectedRoot.arabic}</div>
                  <button onClick={() => handleMastered(selectedRoot.root)} className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedRoot.mastered ? "VERIFIED" : "MARK STABLE"}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-12">
                  {selectedRoot.family.map((f: any) => (
                    <div key={f.word} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                       <div className="text-3xl font-arabic mb-2 text-blue-400">{f.script}</div>
                       <p className="font-bold text-white uppercase text-xs tracking-widest">{f.word}</p>
                       <p className="text-sm text-slate-500 mt-1">{f.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SENTENCE BUILDER SECTION */}
              <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-900/40 relative">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">Live Context Engine</p>
                <div className="text-right">
                  <p className="text-4xl font-arabic text-white mb-4 leading-relaxed">
                    {selectedRoot.root === "K-T-B" ? "الكِتَاب على المَكْتَب" : "العَالِم يَعْرِف المَعْلُومَات"}
                  </p>
                  <p className="text-left text-blue-100 text-sm font-medium opacity-80 border-t border-blue-400 pt-4">
                    {selectedRoot.root === "K-T-B" ? "The book is on the desk (Maktab)." : "The scholar (Alim) knows the information."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}