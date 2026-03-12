'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export default function AslEngine() {
  const [roots] = useState(initialRoots);
  const [activeSprint, setActiveSprint] = useState(1);
  const [selectedRoot, setSelectedRoot] = useState(initialRoots[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ id: number | null, status: 'correct' | 'wrong' | null }>({ id: null, status: null });
  const [stats, setStats] = useState({ gpa: 4.0, streak: 0 });

  // Fisher-Yates Shuffle for true randomness
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
    // 1. Get all roots from current sprint
    const sprintPool = roots.filter(r => r.sprint === activeSprint);
    
    // 2. Ensure the correct answer is the foundation of the quiz options
    let options = [selectedRoot];
    
    // 3. Fill the remaining slots with random distractors from the same sprint
    const distractors = sprintPool
      .filter(r => r.id !== selectedRoot.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3); // Pull up to 3 distractors
      
    options = shuffle([...options, ...distractors]);
    
    setShuffledOptions(options);
    setQuizMode(true);
  };

  const handleAnswer = (chosenId: number) => {
    if (chosenId === selectedRoot.id) {
      // CORRECT: Visual Green + GPA Boost
      setFeedback({ id: chosenId, status: 'correct' });
      setStats(prev => ({ 
        ...prev, 
        gpa: Math.min(4.0, prev.gpa + 0.05), 
        streak: prev.streak + 1 
      }));
      
      setTimeout(() => {
        setQuizMode(false);
        setFeedback({ id: null, status: null });
        // Auto-select a new root from the sprint to keep it dynamic
        const sprintPool = roots.filter(r => r.sprint === activeSprint);
        const nextRoot = sprintPool[Math.floor(Math.random() * sprintPool.length)];
        setSelectedRoot(nextRoot);
      }, 600);
    } else {
      // WRONG: Visual Red + GPA Penalty
      setFeedback({ id: chosenId, status: 'wrong' });
      setStats(prev => ({ 
        ...prev, 
        gpa: Math.max(0, prev.gpa - 0.25), 
        streak: 0 
      }));
      
      setTimeout(() => setFeedback({ id: null, status: null }), 500);
    }
  };

  const sprintRoots = roots.filter(r => r.sprint === activeSprint);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-400 p-6 lg:p-12 font-sans selection:bg-blue-500/30">
      {/* PERFORMANCE HUD */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Mastery GPA</p>
            <p className="text-4xl font-mono text-white font-bold">{stats.gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Streak</p>
            <p className="text-xl text-blue-400 font-black tracking-tighter">{stats.streak} 🔥</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {[1, 2, 3].map(s => (
            <button 
              key={s} 
              onClick={() => {
                setActiveSprint(s);
                const firstInSprint = roots.find(r => r.sprint === s);
                if (firstInSprint) setSelectedRoot(firstInSprint);
                setQuizMode(false);
              }} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${activeSprint === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-600 hover:text-slate-400'}`}
            >
              SPRINT {s}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEARNING MANIFEST */}
        {!quizMode && (
          <div className="lg:col-span-4 space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-bold text-slate-600 mb-4 tracking-[0.3em] uppercase italic">Study Protocol</p>
            {sprintRoots.map((r: any) => (
              <button 
                key={r.id} 
                onClick={() => setSelectedRoot(r)} 
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 ${selectedRoot.id === r.id ? 'border-blue-600 bg-blue-600/5 shadow-2xl scale-[1.02]' : 'border-transparent opacity-30 hover:opacity-100'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-arabic text-white">{r.arabic}</span>
                  <span className="text-[10px] font-mono text-blue-500 font-bold uppercase">{r.root}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ENGINE CORE */}
        <div className={quizMode ? "lg:col-span-12" : "lg:col-span-8"}>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 lg:p-16 rounded-[4rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
            
            {quizMode ? (
              <div className="relative z-10 py-6">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-12 animate-pulse">Identify the Skeleton</p>
                <h2 className="text-[10rem] lg:text-[14rem] font-arabic text-white mb-20 leading-none drop-shadow-2xl">{selectedRoot.arabic}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {shuffledOptions.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => handleAnswer(opt.id)}
                      className={`p-10 rounded-[2.5rem] font-bold text-xl transition-all border-2 duration-200 ${
                        feedback.id === opt.id && feedback.status === 'correct' ? 'bg-green-600 border-green-400 text-white scale-105' :
                        feedback.id === opt.id && feedback.status === 'wrong' ? 'bg-red-600 border-red-400 text-white animate-shake' :
                        'bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {opt.meaning}
                    </button>
                  ))}
                </div>
                <button onClick={() => setQuizMode(false)} className="mt-12 text-[10px] font-bold text-slate-700 hover:text-red-500 uppercase tracking-widest transition-colors">Abort Evaluation</button>
              </div>
            ) : (
              <div className="relative z-10 text-left">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
                  <h2 className="text-[10rem] lg:text-[13rem] font-arabic text-white leading-none tracking-tighter drop-shadow-glow">{selectedRoot.arabic}</h2>
                  <button onClick={startQuiz} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all">
                    Start Pulse
                  </button>
                </div>
                
                <div className="space-y-8">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] border-l-2 border-blue-600 pl-4">Anatomy: {selectedRoot.meaning}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedRoot.family.map((f: any) => (
                      <div key={f.word} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] group hover:bg-white/[0.05] transition-all border-b-4 border-b-transparent hover:border-b-blue-600">
                        <p className="text-6xl font-arabic text-white mb-6 group-hover:text-blue-400 transition-colors leading-tight">{f.script}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{f.word}</p>
                            <p className="text-md text-slate-300 font-medium italic">{f.meaning}</p>
                          </div>
                          <div className="w-8 h-1 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
