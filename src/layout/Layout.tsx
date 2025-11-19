import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useGameStore, ModuleId } from '../store/gameStore';
import { Wallet, CheckCircle, Map, RefreshCw } from 'lucide-react';

const modules: { id: ModuleId; label: string; path: string }[] = [
  { id: 'intro', label: 'Start', path: '/' },
  { id: 'girokonto', label: 'Girokonto', path: '/girokonto' },
  { id: 'payment_methods', label: 'Zahlungsarten', path: '/payment-methods' },
  { id: 'offline', label: 'Einkauf (Offline)', path: '/offline' },
  { id: 'online', label: 'Einkauf (Online)', path: '/online' },
  { id: 'transfer', label: 'Überweisung', path: '/transfer' },
  { id: 'reflection', label: 'Abschluss', path: '/reflection' },
];

export const Layout: React.FC = () => {
  const { balance, completedModules, resetGame, completeModule, setBankDetails, updateBalance, addToInventory } = useGameStore();
  const location = useLocation();
  const navigate = useNavigate();

  const progress = Math.round((completedModules.length / (modules.length - 1)) * 100);

  // Admin Shortcut: Ctrl + ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        const currentIdx = modules.findIndex(m => m.path === location.pathname);
        if (currentIdx !== -1 && currentIdx < modules.length - 1) {
          const currentModule = modules[currentIdx];
          const nextModule = modules[currentIdx + 1];
          
          // Hacky: Set necessary state if skipping
          completeModule(currentModule.id);
          if (currentModule.id === 'girokonto') {
             setBankDetails("DE99 1234 5678 1234 5678 99", "GENODED1MUC", "Cheat Bank");
          }
          if (currentModule.id === 'offline') {
             addToInventory("Snacks (Cheated)");
             updateBalance(-50);
          }
          if (currentModule.id === 'online') {
             addToInventory("Deko (Cheated)");
             updateBalance(-40);
          }

          navigate(nextModule.path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate, completeModule, setBankDetails, updateBalance, addToInventory]);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <span className="font-bold text-xl text-slate-800 hidden sm:block">FinanzChecker</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className={`font-mono font-bold ${balance < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                {balance.toFixed(2).replace('.', ',')} €
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-brand-600" />
              <span>{progress}% Fortschritt</span>
            </div>
            
            <button 
              onClick={() => {
                if(confirm('Spiel wirklich zurücksetzen?')) {
                  resetGame();
                  navigate('/');
                }
              }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
              title="Neustart"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5">
        <div 
          className="bg-brand-600 h-1.5 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, (completedModules.length / modules.length) * 100)}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bg-white border-t border-slate-200 md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="flex justify-around p-3">
           <button onClick={() => navigate('/')} className="flex flex-col items-center text-xs text-slate-600">
             <Map className="w-5 h-5 mb-1" />
             <span>Übersicht</span>
           </button>
        </div>
      </nav>
    </div>
  );
};
