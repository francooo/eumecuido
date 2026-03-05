import React from 'react';

export default function MedicineCabinetScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 min-h-screen flex flex-col items-center justify-start overflow-x-hidden selection:bg-primary/30">
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-background-light dark:bg-surface-dark sticky top-0 z-20 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <button className="text-text-muted hover:text-text-main transition-colors text-sm font-medium p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            Cancel
          </button>
          <h1 className="text-lg font-bold text-text-main dark:text-white tracking-tight">Add Medication</h1>
          <button className="bg-primary hover:bg-primary-dark text-slate-900 font-bold text-sm px-5 py-2 rounded-full shadow-soft transition-all transform active:scale-95">
            Save
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-24 overflow-y-auto">
          {/* Context Banner */}
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-mint-soft dark:bg-white/5 px-4 py-2 rounded-full border border-primary/10">
              <span className="material-symbols-outlined text-primary text-[18px]">child_care</span>
              <p className="text-sm font-medium text-text-main dark:text-slate-200">
                Adding for <span className="font-bold">Leo</span> <span className="text-text-muted dark:text-slate-400 text-xs ml-1">(14kg)</span>
              </p>
            </div>
          </div>

          {/* Photo Scanner Hero */}
          <section className="mb-8 group">
            <div className="relative w-full aspect-[4/3] bg-mint-soft dark:bg-surface-dark rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-sm hover:shadow-soft active:scale-[0.99]">
              {/* Content */}
              <div className="z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="h-16 w-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[32px]">linked_camera</span>
                </div>
                <div>
                  <h3 className="text-text-main dark:text-white font-bold text-lg">Scan Label</h3>
                  <p className="text-text-muted text-sm mt-1 max-w-[200px] mx-auto leading-relaxed">Snap a photo of the box to auto-fill details instantly.</p>
                </div>
                <div className="mt-2 bg-primary/10 text-primary-dark dark:text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  AI Enabled
                </div>
                <p className="text-[10px] text-primary-dark dark:text-primary/70 font-medium mt-1 uppercase tracking-tight">AI will auto-detect units</p>
              </div>
              {/* Decorative Background Abstract */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(43, 238, 186, 0.4) 0%, transparent 60%)' }}></div>
            </div>
          </section>

          {/* Form Section */}
          <section className="flex flex-col gap-6">
            {/* Name Input */}
            <div className="group">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 pl-4">Medicine Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">medication</span>
                </div>
                <input className="input-soft w-full bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-gray-300 dark:placeholder-gray-600 font-bold text-lg rounded-2xl border-0 py-4 pl-12 pr-4 shadow-sm ring-1 ring-slate-100 dark:ring-white/10 transition-all" placeholder="e.g. Ibuprofen" type="text" />
              </div>
            </div>

            {/* Type Toggle */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3 pl-4">Type</label>
              <div className="flex p-1 bg-white dark:bg-surface-dark rounded-full shadow-sm ring-1 ring-slate-100 dark:ring-white/10 relative isolate">
                {/* Active Indicator */}
                <div className="absolute left-1 top-1 bottom-1 w-[32%] bg-primary rounded-full z-[-1] opacity-20 dark:opacity-30"></div>

                <label className="flex-1 cursor-pointer">
                  <input defaultChecked className="peer sr-only" name="type" type="radio" value="liquid" />
                  <div className="flex items-center justify-center gap-2 py-3 px-2 rounded-full transition-all peer-checked:text-slate-900 peer-checked:font-bold text-text-muted hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px] peer-checked:text-primary-dark">water_drop</span>
                    <span className="text-sm">Liquid</span>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input className="peer sr-only" name="type" type="radio" value="tablet" />
                  <div className="flex items-center justify-center gap-2 py-3 px-2 rounded-full transition-all peer-checked:bg-primary peer-checked:text-slate-900 peer-checked:font-bold text-text-muted hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px]">pill</span>
                    <span className="text-sm">Tablet</span>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input className="peer sr-only" name="type" type="radio" value="other" />
                  <div className="flex items-center justify-center gap-2 py-3 px-2 rounded-full transition-all peer-checked:bg-primary peer-checked:text-slate-900 peer-checked:font-bold text-text-muted hover:bg-gray-50 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px]">vaccines</span>
                    <span className="text-sm">Other</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Strength Input */}
            <div className="group">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 pl-4">Strength / Concentration</label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined">science</span>
                    </div>
                    <input className="input-soft w-full bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-gray-300 dark:placeholder-gray-600 font-medium text-lg rounded-2xl border-0 py-4 pl-12 pr-4 shadow-sm ring-1 ring-slate-100 dark:ring-white/10 transition-all" placeholder="e.g. 100" step="any" type="number" />
                  </div>
                  <div className="relative w-32">
                    <select className="input-soft w-full bg-white dark:bg-surface-dark text-text-main dark:text-white font-bold text-base rounded-2xl border-0 py-4 px-4 shadow-sm ring-1 ring-slate-100 dark:ring-white/10 appearance-none transition-all cursor-pointer">
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="drops">drops</option>
                      <option value="mcg">mcg</option>
                      <option value="units">units</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2 pl-4">Enter the numeric value and select unit (ml, mg, drops). AI detects this from labels.</p>
            </div>

            {/* Notes Input */}
            <div className="group">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 pl-4">Instructions / Notes</label>
              <textarea className="input-soft w-full bg-white dark:bg-surface-dark text-text-main dark:text-white placeholder-gray-300 dark:placeholder-gray-600 font-normal text-base rounded-2xl border-0 py-4 px-4 shadow-sm ring-1 ring-slate-100 dark:ring-white/10 resize-none transition-all" placeholder="Take with food, keep refrigerated..." rows={3}></textarea>
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="sticky bottom-0 z-30 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-[#e7f3f0] dark:border-white/5 pb-5 pt-3 px-6">
          <div className="flex justify-between items-center gap-4">
            <a className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity" href="#">
              <span className="material-symbols-outlined text-text-main dark:text-white text-[24px]">home</span>
              <span className="text-[10px] font-bold text-text-main dark:text-white">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-primary" href="#">
              <span className="material-symbols-outlined text-[24px] fill-current">medication_liquid</span>
              <span className="text-[10px] font-bold">Meds</span>
            </a>

            {/* Floating Add Button in Nav */}
            <div className="-mt-8">
              <button className="h-14 w-14 rounded-full bg-primary text-slate-900 shadow-lg shadow-primary/30 flex items-center justify-center transform hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </button>
            </div>

            <a className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity" href="#">
              <span className="material-symbols-outlined text-text-main dark:text-white text-[24px]">calendar_month</span>
              <span className="text-[10px] font-bold text-text-main dark:text-white">Log</span>
            </a>
            <a className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity" href="#">
              <span className="material-symbols-outlined text-text-main dark:text-white text-[24px]">history</span>
              <span className="text-[10px] font-bold text-text-main dark:text-white">History</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}