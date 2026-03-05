import React from 'react';

export default function HistoryScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased selection:bg-primary selection:text-white min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">

        {/* Sticky Header Section */}
        <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pt-4 pb-2 transition-all duration-300">
          {/* Top Nav */}
          <div className="flex items-center justify-between px-6 pb-4">
            <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">History Log</h1>
            <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">filter_list</span>
            </button>
          </div>

          {/* Profile Filter Scroll */}
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 pb-2 pt-1">
            {/* Active Filter */}
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-5 shadow-soft transition-transform active:scale-95">
              <span className="text-slate-900 text-sm font-bold">All</span>
            </button>
            {/* Inactive Filters */}
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 transition-transform active:scale-95 hover:bg-slate-50 dark:hover:bg-white/10">
              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Leo</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 transition-transform active:scale-95 hover:bg-slate-50 dark:hover:bg-white/10">
              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Dad</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 transition-transform active:scale-95 hover:bg-slate-50 dark:hover:bg-white/10">
              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Mom</span>
            </button>
          </div>

          {/* Subtle gradient divider */}
          <div className="h-6 w-full bg-gradient-to-b from-background-light dark:from-background-dark to-transparent absolute bottom-[-24px] pointer-events-none"></div>
        </header>

        {/* Scrollable List Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-28 pt-2">
          {/* Group: Today */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Today</h3>
            <div className="flex flex-col gap-3">

              {/* Card 1: Medicine */}
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">pill</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">Ibuprofen</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">5ml • Leo</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">08:30 AM</span>
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                </div>
              </div>

              {/* Card 2: Weight Check */}
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                    <span className="material-symbols-outlined">monitor_weight</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">Weight Check</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">14.2kg • Leo</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">08:15 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group: Yesterday */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Yesterday</h3>
            <div className="flex flex-col gap-3">

              {/* Card 3: Medicine */}
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">vaccines</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">Amoxicillin</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">5ml • Leo</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">08:00 PM</span>
                </div>
              </div>

              {/* Card 4: Symptom/Temp */}
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card hover:shadow-md transition-all duration-300 border border-transparent hover:border-rose-200 dark:hover:border-rose-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose">
                    <span className="material-symbols-outlined">thermometer</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">Temperature</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">38.5°C • Leo</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">07:45 PM</span>
                  <div className="mt-1 h-2 w-2 rounded-full bg-rose"></div>
                </div>
              </div>

              {/* Card 5: Note */}
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-400">
                    <span className="material-symbols-outlined">sticky_note_2</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">Doctor Note</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">&quot;Drink plenty of water&quot;</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">10:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filler content to show scrolling */}
          <div className="h-12 flex items-center justify-center">
            <span className="text-xs text-slate-300 dark:text-slate-700 italic">End of history for this week</span>
          </div>
        </main>

        {/* Floating Share Button */}
        <div className="fixed bottom-24 left-0 right-0 z-20 flex justify-center px-6 md:absolute">
          <button className="flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 shadow-lg shadow-slate-900/10 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[20px]">ios_share</span>
            <span className="text-base font-bold">Share with Doctor</span>
          </button>
        </div>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 w-full md:absolute z-30 flex gap-2 border-t border-slate-100 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2 max-w-md">
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500 transition-colors hover:text-primary" href="#">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Dashboard</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500 transition-colors hover:text-primary" href="#">
            <span className="material-symbols-outlined text-[24px]">medication</span>
            <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Cabinet</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" href="#">
            <div className="relative">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
              {/* Small indicator dot for active state */}
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">History</p>
          </a>
        </nav>
      </div>
    </div>
  );
}