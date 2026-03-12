'use client';
import { useState, useEffect, useCallback } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslEngine() {
  const [roots] = useState(initialRoots);
  const [activeSprint, setActiveSprint] = useState(1);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ id: number | null, status: 'correct' | 'wrong' | null }>({ id: null, status: null });
  const [stats, setStats] = useState({ gpa: 4.0, streak: 0 });

  // Fisher-Yates Shuffle to prevent gaming the positions
  const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const startQuiz = () => {
    const options = shuffle([...roots.filter(r => r.sprint === activeSprint)]);
    setShuffledOptions(options);
    setQuizMode(true);
  };

  const handleAnswer = (chosenId: number) => {
    if (chosenId === selectedRoot.id) {
      setFeedback({ id: chosenId, status: 'correct' });
      setStats(prev => ({ ...prev, gpa: Math.min(4.0, prev.gpa + 0.05), streak: prev.streak + 1 }));
      
      // Move to next root after a short delay
      setTimeout(() => {
        setQuizMode(false);
        setFeedback({ id: null, status: null });
        const nextIdx = (roots.indexOf(selectedRoot) + 1) % roots.length;
        setSelectedRoot(roots[nextIdx]);
      }, 600);
    } else {
      setFeedback({ id: chosenId, status: 'wrong' });
      setStats(prev => ({ ...prev, gpa: Math.max(0, prev.gpa - 0.25), streak: 0 }));
      
      // Clear wrong flash after a moment
      setTimeout(() => setFeedback({ id: null, status: null }), 500);
    }
  };

  const sprintRoots = roots.filter(r => r.sprint === activeSprint);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-400 p-6 lg:p-12 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Mastery GPA</p>
            <p className="text-4xl font-mono text-white font-bold">{stats.gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streak</p>
            <p className="text-xl text-blue-400 font-black tracking-tighter">{stats.streak}🔥</p>
          </div>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[1, 2, 3].map(s => (
            <button key={s} onClick={() => setActiveSprint(s)} className={`px-6 py-2 rounded-lg text-[10px] font-black ${activeSprint === s ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>SPRINT {s}</button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEARNING / SELECTION COLUMN */}
        {!quizMode && (
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[10px] font-bold text-slate-600 mb-4 tracking-[0.3em] uppercase">Study Manifest</p>
            {sprintRoots.map((r: any) => (
              <button key={r.id} onClick={() => setSelectedRoot(r)} className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${selectedRoot.id === r.id ? 'border-blue-600 bg-white/5 shadow-2xl' : 'border-transparent opacity-30 hover:opacity-100'}`}>
                <span className="text-3xl font-arabic text-white block mb-1">{r.arabic}</span>
                <span className="text-[10px] font-mono text-blue-500 uppercase">{r.meaning}</span>
              </button>
            ))}
          </div>
        )}

        {/* MAIN ENGINE AREA */}
        <div className={quizMode ? "lg:col-span-12" : "lg:col-span-8"}>
          <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full" />
            
            {quizMode ? (
              <div className="relative z-10 py-10">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-12">Identify the Root Skeleton</p>
                <h2 className="text-[12rem] font-arabic text-white mb-20 leading-none">{selectedRoot.arabic}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {shuffledOptions.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => handleAnswer(opt.id)}
                      className={`p-8 rounded-3xl font-bold text-lg transition-all border-2 ${
                        feedback.id === opt.id && feedback.status === 'correct' ? 'bg-green-600 border-green-400 text-white scale-105' :
                        feedback.id === opt.id && feedback.status === 'wrong' ? 'bg-red-600 border-red-400 text-white animate-shake' :
                        'bg-white/5 border-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {opt.meaning}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-left">
                <div className="flex justify-between items-start mb-16">
                  <h2 className="text-[10rem] font-arabic text-white leading-none tracking-tighter">{selectedRoot.arabic}</h2>
                  <button onClick={startQuiz} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all">
                    Initialize Pulse
                  </button>
                </div>
                
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Learning Phase: Family Tree</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRoot.family.map((f: any) => (
                    <div key={f.word} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] group hover:border-blue-900/50 transition-all">
                      <p className="text-5xl font-arabic text-white mb-4 group-hover:text-blue-400 transition-colors">{f.script}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.word}</p>
                        <p className="text-sm text-slate-300 font-medium italic">{f.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
