import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Leaf, RotateCcw, CheckSquare } from 'lucide-react';
import clsx from 'clsx';

export const ReflectionPage: React.FC = () => {
  const [section, setSection] = useState<'statement' | 'analysis'>('statement');
  const { balance, resetGame, userFirstName, userLastName, reflectionAnswers, setReflectionAnswer } = useGameStore();
  const userName = `${userFirstName} ${userLastName}`;
  const navigate = useNavigate();

  // Checklist State
  const [checklist, setChecklist] = useState({
    t1: false, // Eltern
    t2: false, // Supermarkt
    t3: false, // Bargeld
    t4: false, // Party Shop
    t5: false, // Unerwartete Abbuchungen
    t6: false  // Kaution
  });
  const [statementNotes, setStatementNotes] = useState('');

  const transactions = [
    { id: 'tx1', date: '01.06.', recipient: 'Eltern (Geburtstag)', type: 'Gutschrift', amount: 200.00 },
    { id: 'tx2', date: '03.06.', recipient: 'SuperMarkt München', type: 'Kartenzahlung', amount: -18.35 },
    { id: 'tx3', date: '03.06.', recipient: 'Bargeldabhebung', type: 'Geldautomat', amount: -50.00 },
    { id: 'tx4', date: '05.06.', recipient: 'Party Shop Online', type: 'Lastschrift', amount: -45.90 },
    { id: 'tx_fake1', date: '07.06.', recipient: 'Spotify AB', type: 'Lastschrift', amount: -9.99 },
    { id: 'tx5', date: '10.06.', recipient: 'Einzahlung (Kaution)', type: 'Bareinzahlung', amount: 50.00 },
    { id: 'tx6', date: '12.06.', recipient: 'DJ Tobi Entertainment', type: 'Überweisung', amount: -80.00 },
  ];

  const allChecked = Object.values(checklist).every(v => v === true);

  const handleReset = () => {
    if (window.confirm('Möchtest du das Spiel wirklich neu starten? Alle Fortschritte gehen verloren.')) {
      resetGame();
      navigate('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in py-8 space-y-8 pb-20">
      
      {section === 'statement' && (
        <div className="flex flex-col-reverse lg:flex-col gap-8">
           
           {/* YELLOW NOTE (POST-IT STYLE) */}
           <div className="bg-[#fff740] text-slate-900 p-6 shadow-xl rotate-1 lg:max-w-2xl lg:mx-auto w-full relative font-handwriting transform transition hover:rotate-0 duration-300 border-t-8 border-yellow-300/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/50 rotate-2"></div>
              
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 font-sans">
                <CheckSquare className="w-6 h-6" /> Prüfung:
              </h2>
              <p className="mb-4 font-sans text-sm font-bold">
                Szenario: Du hast noch nie einen Kontoauszug gesehen und willst besonders genau sein. 
                Prüfe ihn aufmerksam und vergleiche alles mit deinen Notizen.
              </p>
              
              <div className="space-y-2 font-sans text-sm">
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t1} onChange={e => setChecklist({...checklist, t1: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t1 ? "line-through opacity-50" : ""}>Geldeingang Eltern da?</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t2} onChange={e => setChecklist({...checklist, t2: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t2 ? "line-through opacity-50" : ""}>Hat die Bank das Kautionsgeld bereits eingezahlt?</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t3} onChange={e => setChecklist({...checklist, t3: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t3 ? "line-through opacity-50" : ""}>Hat die Überweisung für den DJ funktioniert?</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t4} onChange={e => setChecklist({...checklist, t4: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t4 ? "line-through opacity-50" : ""}>Ist das Geld vom Online-Einkauf bereits abgebucht worden?</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t5} onChange={e => setChecklist({...checklist, t5: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t5 ? "line-through opacity-50" : ""}>Gibt es unerwartete oder doppelte Abbuchungen?</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-200/50 p-1 rounded">
                    <input type="checkbox" checked={checklist.t6} onChange={e => setChecklist({...checklist, t6: e.target.checked})} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                    <span className={checklist.t6 ? "line-through opacity-50" : ""}>Ist der aktuelle Kontostand korrekt?</span>
                 </label>
              </div>

              {/* Notizen unter dem Zettel */}
              <div className="mt-4 font-sans">
                <label className="block text-xs uppercase tracking-wider font-bold mb-1 text-slate-800">Notizen (Fehler / Besonderheiten)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-yellow-300/70 bg-yellow-50/60 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[84px]"
                  placeholder="Meine Notizen..."
                  value={statementNotes}
                  onChange={(e) => setStatementNotes(e.target.value)}
                />
              </div>

              <div className="mt-6 text-center font-sans">
                 {allChecked ? (
                   <button onClick={() => setSection('analysis')} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition">
                     Fertig geprüft &rarr; Weiter
                   </button>
                 ) : (
                   <span className="text-xs opacity-50 uppercase tracking-widest">Bitte alle Punkte prüfen</span>
                 )}
              </div>
           </div>

          {/* KONTOAUSZUG */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Kontoauszug</h2>
                <p className="text-slate-500">Jugendgiro - Inhaber: {userName}</p>
              </div>
              <div className="text-right">
                 <div className="text-sm text-slate-500">Aktueller Kontostand</div>
                 <div className={clsx("text-2xl font-mono font-bold", balance >= 0 ? "text-emerald-600" : "text-red-600")}>
                   {balance.toFixed(2)} EUR
                 </div>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="py-3 pl-4">Datum</th>
                  <th className="py-3">Empfänger / Verwendungszweck</th>
                  <th className="py-3 hidden sm:table-cell">Vorgang</th>
                  <th className="py-3 pr-4 text-right">Betrag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-sm">
                {transactions.map((t, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 pl-4 align-top whitespace-nowrap">{t.date}</td>
                    <td className="py-4 align-top font-bold text-slate-700">
                      {t.recipient}
                    </td>
                    <td className="py-4 align-top text-slate-500 hidden sm:table-cell">{t.type}</td>
                    <td className={clsx(
                      "py-4 pr-4 text-right font-bold align-top whitespace-nowrap",
                      t.amount > 0 ? "text-emerald-600" : "text-slate-900"
                    )}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 text-sm text-slate-400 text-center italic">
               Ende des Auszugs Nr. 1
            </div>
          </div>
        </div>
      )}

      {section === 'analysis' && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <Leaf className="text-brand-600" /> Deine Analyse
            </h2>
            
            <div className="space-y-8">
              
              <div>
                <label className="block font-bold mb-2 text-lg">1. Nachhaltiger feiern</label>
                <p className="text-slate-600 mb-3 text-sm">
                  Die Party hat viel Müll produziert (Einweg-Deko, Plastikflaschen). 
                  Nenne 3 konkrete Maßnahmen, wie du die <strong>gleiche Stimmung</strong> mit weniger Umweltbelastung hättest erreichen können.
                </p>
                <textarea 
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px]"
                  placeholder="1. ..."
                  value={reflectionAnswers.sustainability}
                  onChange={(e) => setReflectionAnswer('sustainability', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold mb-2 text-lg">2. Konsum kritisch hinterfragen</label>
                <p className="text-slate-600 mb-3 text-sm">
                  Der DJ war der teuerste Posten. War er unverzichtbar für den Erfolg der Party? 
                  Welche kreativen (und günstigeren) Alternativen gäbe es für die Musikgestaltung?
                </p>
                <textarea 
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px]"
                  placeholder="Meine Meinung..."
                  value={reflectionAnswers.necessary}
                  onChange={(e) => setReflectionAnswer('necessary', e.target.value)}
                />
              </div>

            </div>
          </div>

          {reflectionAnswers.sustainability && reflectionAnswers.necessary && (
             <div className="text-center animate-fade-in pb-12">
                <h3 className="text-2xl font-bold mb-4">Projekt abgeschlossen.</h3>
                <p className="text-slate-600 mb-8 text-lg">
                  Du hast bewiesen, dass du ein Budget verwalten, Verträge verstehen und Fehler finden kannst. 
                  <br/>Viel Erfolg mit deinem echten ersten Konto!
                </p>
                <button 
                  onClick={handleReset}
                  className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" /> Simulation neu starten
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
