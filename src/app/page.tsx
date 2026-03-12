'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslEngine() {
  const [roots, setRoots] = useState(initialRoots);
  const [activeSprint, setActiveSprint] = useState(1);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  
  // REGIMENTED STATS
  const [stats, setStats] = useState({
    gpa: 4.0,
    streak: 0,
    rank: 'Novice'
  });

  // GRADED QUIZ LOGIC
  const handleQuizAnswer = (isCorrect: boolean, timeTaken: number) => {
    if (!isCorrect) {
      setStats(prev => ({ ...prev, streak: 0, gpa: Math.max(0, prev.gpa - 0.5) }));
      return;
    }

    // A = < 3s, B = < 6s, C = > 6s
    let points = timeTaken < 3000 ? 0.1 : timeTaken < 6000 ? 0.05 : 0.01;
    setStats(prev => ({
      ...prev,
      streak: prev.streak + 1,
      gpa: Math.min(4.0, prev.gpa + points),
      rank: prev.gpa > 3.5 ? 'Elite' : prev.gpa > 2.5 ? 'Strategic' : 'Novice'
    }));
  };

  const sprintRoots = roots.filter((r: any) => r.sprint === activeSprint);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-400 font-sans p-4 lg:p-10">
      {/* HUD / PERFORMANCE MONITOR */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Mastery GPA</p>
            <p className="text-3xl font-mono text-white font-bold">{stats.gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Rank</p>
            <p className="text-xl text-blue-400 font-black italic">{stats.rank}</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <button 
              key={s}
              onClick={() => setActiveSprint(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${activeSprint === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-600 opacity-50'}`}
            >
              SPRINT {s}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR: TARGET ROOTS */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-[10px] font-bold text-slate-600 mb-4 tracking-[0.3em] uppercase">Target Manifest</p>
          {sprintRoots.map((r: any) => (
            <button 
              key={r.root}
              onClick={() => setSelectedRoot(r)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${selectedRoot.id === r.id ? 'border-blue-600 bg-white/5 shadow-2xl scale-[1.02]' : 'border-transparent opacity-40 hover:opacity-80'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-arabic text-white">{r.arabic}</span>
                <span className="text-[10px] font-mono text-blue-500">{r.root}</span>
              </div>
            </button>
          ))}
        </div>

        {/* MAIN DISPLAY: ANATOMY & FAMILY */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <p className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-widest">Core Root Skeleton</p>
                  <h2 className="text-9xl font-arabic text-white leading-none tracking-tighter">{selectedRoot.arabic}</h2>
               </div>
               <button 
                onClick={() => setQuizMode(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
               >
                Begin Graded Pulse
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {selectedRoot.family.map((f: any) => (
                 <div key={f.word} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-blue-900/50 transition-all group">
                    <p className="text-4xl font-arabic text-white mb-2 group-hover:text-blue-400 transition-colors">{f.script}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.word}</p>
                      <p className="text-xs text-slate-300 font-medium italic">{f.meaning}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* DYNAMIC SENTENCE BUILDER */}
          <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex justify-between items-center">
             <div className="max-w-[60%]">
                <p className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-widest">Structural Context</p>
                <p className="text-lg text-slate-200 font-medium italic opacity-80 leading-snug">
                   "{selectedRoot.meaning} forms the basis of strategic communication in Sprint {activeSprint}."
                </p>
             </div>
             <div className="text-right">
                <p className="text-5xl font-arabic text-blue-500 mb-1 leading-none">{selectedRoot.arabic}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Radar Locked</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
