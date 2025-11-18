import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { ArrowRight, PartyPopper } from 'lucide-react';

export const IntroPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setUserNames, userFirstName, balance } = useGameStore();
  const navigate = useNavigate();

  const handleStart = () => {
    if (firstName.trim() && lastName.trim()) {
      setUserNames(firstName.trim(), lastName.trim());
      navigate('/girokonto');
    }
  };

  if (userFirstName) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <PartyPopper className="w-16 h-16 text-brand-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Willkommen zurück, {userFirstName}!</h1>
          <p className="text-slate-600 mb-8 text-lg">
            Deine Geburtstagsplanung läuft bereits. Du hast aktuell <strong>{balance.toFixed(2)} €</strong> Budget.
            Mach weiter, wo du aufgehört hast.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => navigate('/girokonto')}
              className="flex items-center justify-center p-4 bg-white border-2 border-brand-100 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all group"
            >
              <span className="font-semibold text-brand-700 group-hover:text-brand-800">Weiter zum Girokonto</span>
              <ArrowRight className="w-5 h-5 ml-2 text-brand-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-100 p-4 rounded-full">
            <PartyPopper className="w-12 h-12 text-brand-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Dein 16. Geburtstag
        </h1>
        <p className="text-center text-slate-500 mb-8">
          Finanzkompetenz für deine erste eigene Party
        </p>

        <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
          <p>
            Hallo! Du wirst bald 16 Jahre alt und möchtest eine <strong>große Geburtstagsparty</strong> feiern.
            Deine Eltern unterstützen dich mit 200 €, aber du musst alles selbst organisieren und verwalten.
          </p>
          <p>
            Das ist der perfekte Zeitpunkt, um endlich dein eigenes Konto zu eröffnen und den Umgang mit Geld zu lernen.
          </p>
          
          <ul className="space-y-3 bg-slate-50 p-6 rounded-xl text-base">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold mr-3">1</span>
              <span>Eröffne dein erstes eigenes Girokonto.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold mr-3">2</span>
              <span>Lerne verschiedene Zahlungsarten kennen (Bankeinzug, PayPal, etc.).</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold mr-3">3</span>
              <span>Kaufe Snacks offline und Deko online.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold mr-3">4</span>
              <span>Verstehe deinen Kontoauszug.</span>
            </li>
          </ul>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Bitte gib deinen Namen ein, um zu starten:
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Vorname"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nachname"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>
          </div>
          <button
            onClick={handleStart}
            disabled={!firstName.trim() || !lastName.trim()}
            className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            Starten
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
