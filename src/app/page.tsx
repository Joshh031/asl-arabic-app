'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslHardMode() {
  const [roots, setRoots] = useState(initialRoots);
  const [activeSprint, setActiveSprint] = useState(1);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [stats, setStats] = useState({ gpa: 4.0, rank: 'Novice' });

  useEffect(() => { if (quizMode) setStartTime(Date.now()); }, [quizMode, selectedRoot]);

  const handleSubmission = (value: string) => {
    const isCorrect = value.toLowerCase().trim() === selectedRoot.meaning.toLowerCase();
    const timeTaken = Date.now() - startTime;
    
    if (isCorrect) {
      const points = timeTaken < 3000 ? 0.1 : 0.02;
      setStats(prev => ({ 
        ...prev, 
        gpa: Math.min(4.0, prev.gpa + (hardMode ? points * 2 : points)),
        rank: prev.gpa > 3.5 ? 'Elite' : 'Strategic'
      }));
      setUserInput('');
      const nextIdx = (roots.indexOf(selectedRoot) + 1) % roots.length;
      setSelectedRoot(roots[nextIdx]);
    } else {
      setStats(prev => ({ ...prev, gpa: Math.max(0, prev.gpa - 0.2) }));
    }
  };

  const sprintRoots = roots.filter((r: any) => r.sprint === activeSprint);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-400 p-6 lg:p-12 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Mastery GPA</p>
            <p className="text-4xl font-mono text-white font-bold">{stats.gpa.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => setHardMode(!hardMode)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black border transition-all ${hardMode ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-blue-600/20 border-blue-500 text-blue-500'}`}
          >
            {hardMode ? 'HARD MODE: ON' : 'HARD MODE: OFF'}
          </button>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[1, 2].map(s => (
            <button key={s} onClick={() => setActiveSprint(s)} className={`px-6 py-2 rounded-lg text-[10px] font-black ${activeSprint === s ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>SPRINT {s}</button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-3">
          {sprintRoots.map((r: any) => (
            <button key={r.root} onClick={() => setSelectedRoot(r)} className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${selectedRoot.id === r.id ? 'border-blue-600 bg-white/5 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`}>
              <span className="text-3xl font-arabic text-white block mb-1">{r.arabic}</span>
              <span className="text-[10px] font-mono text-blue-500 uppercase">{r.root}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 p-12 rounded-[3rem] text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full" />
          {quizMode ? (
            <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-8">Translate the Skeleton</p>
              <h2 className="text-[10rem] font-arabic text-white mb-12 leading-none">{selectedRoot.arabic}</h2>
              {hardMode ? (
                <input 
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmission(userInput)}
                  placeholder="Type meaning..."
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl text-white text-center text-xl w-full max-w-md focus:border-blue-500 outline-none"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {roots.map((r: any) => (
                    <button key={r.id} onClick={() => handleSubmission(r.meaning)} className="p-6 bg-white/5 border border-white/5 rounded-2xl text-white font-bold hover:bg-blue-600 transition-all">{r.meaning}</button>
                  ))}
                </div>
              )}
              <button onClick={() => setQuizMode(false)} className="mt-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest block mx-auto">Abort Session</button>
            </div>
          ) : (
            <div className="relative z-10 py-10">
              <h2 className="text-[10rem] font-arabic text-white mb-8 leading-none">{selectedRoot.arabic}</h2>
              <p className="text-2xl font-bold text-blue-500 uppercase tracking-widest mb-12">{selectedRoot.meaning}</p>
              <button onClick={() => setQuizMode(true)} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40">Enter Graded Pulse</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
