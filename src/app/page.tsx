'use client';
import { useState } from 'react';
import roots from '@/data/roots.json';

export default function AslApp() {
  const [selectedRoot, setSelectedRoot] = useState(roots[0]);
  const [silentMode, setSilentMode] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 text-slate-900 font-sans">
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">ASL <span className="text-blue-600">أصل</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Structural Compounding Engine</p>
        </div>
        <button 
          onClick={() => setSilentMode(!silentMode)}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 ${
            silentMode ? 'bg-white border-slate-200 text-slate-400' : 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200'
          }`}
        >
          {silentMode ? "Visual Logic Mode" : "Phonetic Mode"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: The Root Ribbon (Discovery) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Root Family</h2>
          {roots.map((r) => (
            <button
              key={r.root}
              onClick={() => setSelectedRoot(r)}
              className={`w-full text-left p-6 rounded-[1.5rem] transition-all border-2 ${
                selectedRoot.root === r.root 
                ? 'bg-white border-blue-500 shadow-lg shadow-blue-100' 
                : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-arabic">{r.arabic}</span>
                <span className="text-xs font-mono font-bold">{r.root}</span>
              </div>
              <p className="text-xs font-bold uppercase mt-2 opacity-60">{r.meaning}</p>
            </button>
          ))}
        </div>

        {/* Right: The Compounding Lab */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="mb-10 pb-10 border-b border-slate-50">
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Current Family Base</h3>
                <div className="text-8xl font-arabic mb-4 tracking-widest">{selectedRoot.arabic}</div>
                <p className="text-slate-500 text-lg">Concepts related to <span className="font-bold text-slate-800">"{selectedRoot.meaning}"</span></p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedRoot.family.map((f) => (
                  <div key={f.word} className="group p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all cursor-default">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl font-arabic text-slate-800 group-hover:text-blue-700 transition-colors">
                        {f.script}
                        {silentMode && <span className="text-blue-400 text-2xl align-top"> َ </span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{f.type}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{f.word}</h4>
                    <p className="text-sm text-slate-500">{f.meaning}</p>
                  </div>
                ))}
             </div>
          </div>
          
          {/* Compounding Logic Note */}
          <div className="bg-blue-900 text-white p-8 rounded-[2rem] flex items-center gap-6">
             <div className="text-4xl">💡</div>
             <p className="text-sm leading-relaxed opacity-90">
                Notice how the letters <span className="font-bold underline">{selectedRoot.arabic}</span> remain consistent. 
                In Arabic, the **structure** (the pattern of vowels) changes the meaning, but the **root** remains the anchor of the concept.
             </p>
          </div>
        </div>
      </div>
    </main>
  );
}