import React from 'react';

export default function WeightCheckScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex items-center justify-center p-4">
      {/* Mock Background Content (Blurred) */}
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40 blur-sm flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-muted">BOM DIA</span>
            <span className="text-xl font-bold text-text-main dark:text-white">Sarah & Leo</span>
          </div>
          <div className="h-10 w-10 bg-primary/20 rounded-full"></div>
        </div>

        {/* Cards in background */}
        <div className="px-6 space-y-4">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl h-32 w-full shadow-sm"></div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl h-32 w-full shadow-sm"></div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl h-32 w-full shadow-sm"></div>
        </div>
      </div>

      {/* Overlay Backdrop */}
      <div className="fixed inset-0 bg-background-light/60 dark:bg-background-dark/80 backdrop-blur-md z-10"></div>

      {/* Main Modal Card */}
      <main className="relative z-20 w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6 flex flex-col items-center gap-8 animate-fade-in-up">
        {/* Close Button (Top Right) */}
        <div className="w-full flex justify-end">
          <button className="text-text-muted hover:text-text-main dark:hover:text-white transition-colors p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark/50">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Vamos ser precisos</h1>
          <p className="text-text-muted text-lg font-medium">Qual é o peso atual de Leo?</p>
        </div>

        {/* Weight Input Section */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Large Input Area with Steppers */}
          <div className="flex items-center justify-center gap-4 w-full">
            {/* Minus Button */}
            <button aria-label="Diminuir peso" className="h-12 w-12 rounded-full bg-background-light dark:bg-background-dark text-text-muted hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all active:scale-95">
              <span className="material-symbols-outlined">remove</span>
            </button>

            {/* Numeric Display */}
            <div className="relative group">
              <input
                className="peer w-40 text-center text-6xl font-bold bg-transparent border-none p-0 text-text-main dark:text-white focus:ring-0 placeholder-text-muted/30 selection:bg-primary/30"
                placeholder="14.0"
                step="0.1"
                type="number"
                defaultValue="14.2"
              />
              <span className="absolute top-2 -right-8 text-xl font-bold text-text-muted mt-2">kg</span>

              {/* Underline decoration */}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
                <div className="w-full h-full bg-primary origin-left scale-x-0 transition-transform duration-300 peer-focus:scale-x-100"></div>
              </div>
            </div>

            {/* Plus Button */}
            <button aria-label="Aumentar peso" className="h-12 w-12 rounded-full bg-background-light dark:bg-background-dark text-text-muted hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all active:scale-95">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          {/* Contextual Info */}
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">history</span>
            <span className="text-sm font-medium text-text-muted">Último registro: 14.0kg (2 semanas atrás)</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg w-full flex items-start gap-3 border border-red-100 dark:border-red-900/20">
          <span className="material-symbols-outlined text-red-400 shrink-0" style={{ fontSize: '20px' }}>info</span>
          <p className="text-sm text-red-800 dark:text-red-200 leading-snug">
            Segurança em primeiro lugar: A dosagem será rigorosamente calculada com base neste valor. Por favor, verifique se está atualizado.
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full bg-primary hover:bg-[#25dcb0] text-primary-content font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
          <span>Calcular Dose Segura</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </main>

      {/* decorative blurred orb behind the modal for "Soft Comfort" feel */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}