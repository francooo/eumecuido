import React from 'react';

export default function DashboardScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 min-h-screen flex justify-center">
      {/* Mobile Container */}
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl">

        {/* Header Section */}
        <header className="pt-8 px-6 pb-2 bg-background-light dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Good Morning, Sarah</h1>
              <p className="text-lavender font-bold text-xs tracking-widest uppercase mt-1">OCT 24 • THURSDAY</p>
            </div>
            <div className="relative group cursor-pointer">
              <span className="material-symbols-outlined text-text-muted dark:text-primary/70 text-3xl">notifications</span>
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-white dark:ring-background-dark"></span>
            </div>
          </div>
        </header>

        {/* Profile Selector (Horizontal Scroll) */}
        <section className="py-4 pl-6 overflow-x-auto no-scrollbar w-full">
          <div className="flex gap-4 pr-6">
            {/* Profile 1: Active */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[64px]">
              <div className="relative p-1 rounded-full border-2 border-primary">
                <div
                  className="size-16 rounded-full bg-cover bg-center shadow-sm"
                  aria-label="Portrait of a young child named Leo smiling"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB900wM7OC9J0Ps93Sq6a3Sd9bHXVmE3jkz01hEaxD3gUfWfsLHPZp3Ny3EAkDD4FRN0h2Quh0MrU4gqv-zKwl-ZmLmgdmhWLM6wE9mePEwOWQztzFkc1MGKSITwPsVXdexLG00gS6zh9TiaTOQiX-m26EXJw7VAxrBJplEBzO0Bbtmv2caPf1gVw-pt2W-4hkM1t7p1R2QeaGNUwWsVSD-rjOn8bdgViKQ262hFgU5RhEmQoIziSYz1MN_yz0NH0gH7pmHm21gLe8")' }}
                ></div>
                <div className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-1 border-2 border-white dark:border-background-dark flex items-center justify-center size-6">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              </div>
              <span className="text-sm font-bold text-primary dark:text-primary">Leo</span>
            </div>

            {/* Profile 2 */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[64px] opacity-60 hover:opacity-100 transition-opacity">
              <div className="relative p-1 rounded-full border-2 border-transparent hover:border-lavender">
                <div
                  className="size-16 rounded-full bg-cover bg-center bg-gray-200"
                  aria-label="Portrait of an adult male named Dad"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDR_Wq-UMVzFIU5p0zE65G3Rciq4GNtPnN5RcQdYJ6gDZnFtNbjcvZ8pCDdsx7IjdYXs6ihBZp61pkfA7gBDdjlF1d0kwxIs9wWSczJDqolFUadeSxkA4MaA3ZdvPbStd8bLRee-3R3IhplsGOdul5afJqrdDWL_fYECCUWL3D7v8047Uvqz23y_5MqCeie90EgVCp3hDs1yxZhY26v2rmBdpCKL1IVlbnY5qiqQwLnzvAVh7XOwHusac8Vzo3PqTldu1QfdrYFEZA")' }}
                ></div>
              </div>
              <span className="text-sm font-medium text-text-muted dark:text-gray-400">Dad</span>
            </div>

            {/* Profile 3 */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[64px] opacity-60 hover:opacity-100 transition-opacity">
              <div className="relative p-1 rounded-full border-2 border-transparent hover:border-lavender">
                <div
                  className="size-16 rounded-full bg-cover bg-center bg-gray-200"
                  aria-label="Portrait of an adult female named Mom"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcKNA23u0sDrd-3sJ0asySVT72JSNw7f3YNh6cb8oi_uy0br9-WJOP5jqzaSci8cImuggDpD3rSm5NlpSN7o6UoHEo4_xEC22XM_6AW39hqZrftSuPpuOshJkwNtPa-7_JGyb8t96NAdMGDbyeyNqODdSlYzdpzUbyo1PGnvf4prJxBEawDGxfvIu61rGpaVS37JtAzT0ZkbTQ9ziQFv9qJ-wSg2LDZyyf8a1xR4sNOFi1NkGZBO0Te2Kkr228KLaC0ar90ScSCqI")' }}
                ></div>
              </div>
              <span className="text-sm font-medium text-text-muted dark:text-gray-400">Mom</span>
            </div>

            {/* Add New Profile */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[64px]">
              <div className="relative p-1 rounded-full border-2 border-dashed border-lavender flex items-center justify-center size-[72px] bg-lavender-light/50 dark:bg-surface-dark">
                <span className="material-symbols-outlined text-lavender text-2xl">add</span>
              </div>
              <span className="text-sm font-medium text-text-muted dark:text-gray-400">Add</span>
            </div>
          </div>
        </section>

        {/* Main Dashboard Feed */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 pt-2 flex flex-col gap-6">
          {/* High Priority: Next Dose Card */}
          <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft overflow-hidden relative group transition-transform hover:scale-[1.01]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-lavender"></div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="bg-lavender-light dark:bg-gray-700 p-2.5 rounded-full text-lavender dark:text-gray-300">
                    <span className="material-symbols-outlined text-2xl">pill</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">Amoxicillin</h3>
                    <p className="text-text-muted dark:text-gray-400 text-sm font-medium">5ml • Liquid</p>
                  </div>
                </div>
                <div className="bg-rose-light dark:bg-rose/20 text-rose dark:text-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> Due 9:00 AM
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex -space-x-2">
                  {/* Context avatars/icons if needed */}
                </div>
                <button className="bg-primary hover:bg-primary/90 text-primary-content px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check</span>
                  Log Now
                </button>
              </div>
            </div>
          </div>

          {/* Mini Widgets Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight Tracker Widget */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-card flex flex-col justify-between h-36 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div>
                  <p className="text-xs font-bold text-lavender uppercase tracking-wider">Weight</p>
                  <h4 className="text-2xl font-bold text-text-main dark:text-white mt-1">14.2<span className="text-sm text-text-muted ml-1 font-normal">kg</span></h4>
                </div>
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                  <span className="material-symbols-outlined text-lg">monitor_weight</span>
                </div>
              </div>
              {/* Sparkline SVG */}
              <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0 35 Q 20 30, 40 25 T 100 10 L 100 40 L 0 40 Z" fill="rgba(43, 238, 186, 0.2)"></path>
                  <path d="M0 35 Q 20 30, 40 25 T 100 10" fill="none" stroke="#2beeba" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </div>
              <p className="text-[10px] text-text-muted dark:text-gray-500 z-10 mt-auto pt-2">+0.4kg since last check</p>
            </div>

            {/* Next Up Widget (Low Priority) */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-card flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-lavender uppercase tracking-wider">Upcoming</p>
                  <h4 className="text-lg font-bold text-text-main dark:text-white mt-1">Ibuprofen</h4>
                  <p className="text-xs text-text-muted dark:text-gray-400">Tablet • 200mg</p>
                </div>
                <div className="bg-lavender-light dark:bg-gray-700 p-1.5 rounded-full text-lavender dark:text-gray-300">
                  <span className="material-symbols-outlined text-lg">event_upcoming</span>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-2 text-text-muted dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>2:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday's Summary (Collapsible/Soft) */}
          <div className="mt-2">
            <h3 className="text-sm font-bold text-lavender uppercase tracking-widest mb-3 pl-1">Yesterday</h3>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-card flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                </div>
                <div>
                  <p className="text-text-main dark:text-white font-bold text-sm">All Doses Logged</p>
                  <p className="text-xs text-text-muted dark:text-gray-400">Leo had a good day</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-lavender">chevron_right</span>
            </div>
          </div>
        </main>

        {/* Floating Action Button (FAB) */}
        <div className="absolute bottom-24 right-6 z-20">
          <button className="bg-primary hover:bg-primary/90 text-primary-content rounded-full size-14 shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group">
            <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
          </button>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-[#e7f3f0] dark:border-gray-800 bg-background-light dark:bg-background-dark px-6 pb-6 pt-2 z-30">
          <div className="flex justify-between items-end">
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <div className="flex h-8 items-center justify-center text-text-main dark:text-white transition-colors group-hover:text-primary">
                <span className="material-symbols-outlined text-[28px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              </div>
              <span className="text-[10px] font-bold text-text-main dark:text-white">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <div className="flex h-8 items-center justify-center text-text-muted dark:text-gray-500 transition-colors group-hover:text-primary">
                <span className="material-symbols-outlined text-[28px]">history</span>
              </div>
              <span className="text-[10px] font-medium text-text-muted dark:text-gray-500">History</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <div className="flex h-8 items-center justify-center text-text-muted dark:text-gray-500 transition-colors group-hover:text-primary">
                <span className="material-symbols-outlined text-[28px]">settings</span>
              </div>
              <span className="text-[10px] font-medium text-text-muted dark:text-gray-500">Settings</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}