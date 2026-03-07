'use client';
import { useState, useEffect } from 'react';
import initialRoots from '@/data/roots.json';

export const dynamic = 'force-dynamic';

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
    <main className="min-h-screen bg-[#0A0A0B] p-4 lg:p-12 text-slate-300 font-sans selection:bg-blue-500/30">
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-10 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            ASL <span className="text-blue-500 font-normal">أصل</span>
          </h1>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button 
                key={lvl} 
                onClick={() => {
                  setCurrentLevel(lvl);
                  const firstOfLevel = roots.find((r: any) => r.level === lvl);
                  if (firstOfLevel) setSelectedRoot(firstOfLevel);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border shrink-0 ${
                  currentLevel === lvl ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-transparent border-white/10 text-slate-500'
                }`}
              >
                LEVEL {lvl}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setQuizMode(!quizMode)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
          {quizMode ? "Exit Pulse" : "Pulse Quiz"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {quizMode ? (
          <div className="lg:col-span-12 bg-[#111114] border border-white/5 p-12 lg:p-24 rounded-[3rem] text-center shadow-2xl">
            <div className="text-8xl lg:text-9xl font-arabic text-blue-500 mb-12 drop-shadow-glow">{selectedRoot.arabic}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {filteredRoots.map((r: any) => (
                <button key={r.root} onClick={() => r.root === selectedRoot.root ? handleMastered(r.root) : alert("Incorrect")} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl font-bold hover:bg-blue-600 transition-all text-white">
                  {r.meaning}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="lg:col-span-4 space-y-4 max-h-[60vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
              {filteredRoots.map((r: any) => (
                <button key={r.root} onClick={() => setSelectedRoot(r)} className={`w-full text-left p-6 rounded-2xl transition-all border-2 ${selectedRoot.root === r.root ? 'border-blue-600 bg-[#16161A] shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-arabic text-white">{r.arabic}</span>
                    {r.mastered && <span className="text-blue-400 text-[10px] font-black tracking-tighter">VERIFIED</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#111114] p-8 lg:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="flex justify-between items-start relative z-10 mb-10">
                  <div className="text-8xl lg:text-9xl font-arabic text-white leading-none">{selectedRoot.arabic}</div>
                  <button onClick={() => handleMastered(selectedRoot.root)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedRoot.mastered ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-500 border-white/10 hover:border-blue-500/50'}`}>
                    {selectedRoot.mastered ? "MASTERED" : "MARK STABLE"}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 relative z-10">
                  {selectedRoot.family.map((f: any) => (
                    <div key={f.word} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                       <div className="text-4xl font-arabic mb-3 text-blue-400 group-hover:text-blue-300">{f.script}</div>
                       <p className="font-bold text-white uppercase text-[10px] tracking-widest">{f.word}</p>
                       <p className="text-sm text-slate-500 mt-1 font-medium">{f.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RADAR SENTENCE ENGINE */}
              <div className="bg-blue-600 p-8 lg:p-10 rounded-[3rem] shadow-2xl shadow-blue-900/40 relative group transition-all hover:bg-blue-500 border border-blue-400/20">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Live Context Radar
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl lg:text-5xl font-arabic text-white mb-6 leading-relaxed tracking-widest">
                    {(() => {
                      const sentences: any = {
                        "K-T-B": "الكِتَاب على المَكْتَب",
                        "D-R-S": "المَدْرَسَة مَكَان لِلدِّرَاسَة",
                        "H-K-M": "الحُكُومَة تَضَع القَانُون",
                        "A-L-M": "العَالِم يَعْرِف المَعْلُومَات",
                        "S-F-R": "السَّفِير في السِّفَارَة",
                        "S-W-Q": "التَّسْوِيق مُهِمّ لِلسُّوق"
                      };
                      const sentence = sentences[selectedRoot.root] || "اخْتَر جَذْرًا لِبِنَاء جُمْلَة";
                      const rootLetters = selectedRoot.arabic.split(' ');
                      
                      return sentence.split('').map((char: string, i: number) => (
                        <span key={i} className={rootLetters.includes(char) ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] font-black" : ""}>
                          {char}
                        </span>
                      ));
                    })()}
                  </div>
                  <p className="text-left text-blue-100 text-[12px] font-bold opacity-70 border-t border-blue-400/50 pt-4 uppercase tracking-tighter">
                    {(() => {
                        const translations: any = {
                            "K-T-B": "The book is on the desk.",
                            "D-R-S": "The school is a place for study.",
                            "H-K-M": "The government sets the law.",
                            "A-L-M": "The scholar knows the information.",
                            "S-F-R": "The ambassador is in the embassy.",
                            "S-W-Q": "Marketing is important for the market."
                        };
                        return translations[selectedRoot.root] || "Select a root to see it in action.";
                    })()}
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