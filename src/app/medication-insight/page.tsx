import React from 'react';

export default function MedicationInsightScreen() {
  return (
    <div className="bg-gray-800 font-display flex justify-center items-end min-h-screen overflow-hidden">
      {/* Background Context (Blurred Dashboard Simulation) */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none"
        aria-label="Blurred abstract floral background representing a calm home environment"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMXj8E7gF4Um6h4baTCitcQUqcS2EJzIbuDVOU8SnEE0zICKffnW9w6eGT74de1QgLc64u_oyKJSIs6qOqClgSsPATGFFHV91YY46_K-8c6fmNrMlblOaeRax0QmYd2mcpOz7MIICaBXdR412Kl-9_M03qeqa8X1xXny5hToVxL_jGDZAG2CNJ1VCdMS83hcu0_vuJIuufOkUVTFUmjetKcRxu6x2JS42B5EqOXoVQ8UToGHhbs4cD-46eSRezaIgmv5NeLUfyWdA")' }}
      ></div>

      {/* Main Modal Sheet */}
      <main className="relative w-full max-w-md bg-background-light dark:bg-background-dark rounded-t-[32px] shadow-2xl h-[92vh] flex flex-col overflow-hidden transition-all duration-500 ease-out transform translate-y-0">

        {/* Drag Handle Area */}
        <div className="w-full flex justify-center pt-5 pb-2 shrink-0 cursor-pointer">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header Section */}
        <header className="px-8 pt-4 pb-6 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender/50 text-text-lavender mb-3">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                <span className="text-xs font-bold uppercase tracking-wider">Resumo IA</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Amoxicillin</h1>
              <p className="text-slate-500 text-sm mt-1">Suspensão Oral • 250mg/5ml</p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 text-slate-400 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">

          {/* Dosage Calculation Card */}
          <div className="relative overflow-hidden rounded-[32px] bg-primary p-8 mb-8 shadow-glow group">
            {/* Decorative background blobs */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary-dark mb-2 opacity-90">
                <span className="material-symbols-outlined text-xl">calculate</span>
                <span className="text-xs font-bold tracking-widest uppercase">Dose Segura Calculada</span>
              </div>

              <div className="flex items-baseline gap-1 mt-4">
                <div className="flex items-center bg-white/30 px-5 py-2 rounded-2xl backdrop-blur-sm">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">4.5</span>
                  <span className="text-2xl font-bold text-slate-900/40 mx-3">-</span>
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">5</span>
                  <span className="text-2xl font-semibold text-slate-900/60 ml-3 lowercase">ml</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-slate-900">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-primary-dark font-bold uppercase tracking-wide">Frequência</p>
                    <p className="text-slate-900 font-bold">A cada 8 horas</p>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-slate-900/10"></div>
                <div className="flex items-center gap-3 pr-2">
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-slate-900">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-xs text-primary-dark font-bold uppercase tracking-wide">Duração</p>
                    <p className="text-slate-900 font-bold">5 Dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* "Atenção" Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-text-rose">gpp_maybe</span>
              Atenção
            </h2>
            <div className="bg-soft-rose rounded-[28px] p-6 border border-rose-100">
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white shrink-0 flex items-center justify-center text-text-rose mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">Tomar com alimento</p>
                    <p className="text-slate-500 text-sm leading-relaxed mt-1">To avoid tummy aches, it&apos;s best to give this dose right after a meal or snack.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white shrink-0 flex items-center justify-center text-text-rose mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">Pode causar sonolência</p>
                    <p className="text-slate-500 text-sm leading-relaxed mt-1">Leo might be a bit sleepier than usual. Monitor during playtime.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Full Leaflet Link */}
          <div className="text-center mb-6">
            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-medium py-2 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-[18px]">description</span>
              Ler bula oficial (PDF)
            </button>
          </div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12">
          <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            Entendi, Obrigado
          </button>
        </div>
      </main>
    </div>
  );
}