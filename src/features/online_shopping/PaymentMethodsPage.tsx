import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Globe, Banknote, ShieldCheck, Building, Link2 } from 'lucide-react';
import clsx from 'clsx';

type Item = {
  id: string;
  text: string;
  icon?: React.ReactNode;
  matchId: string;
};

const terms: Item[] = [
  { id: 't1', text: 'Girocard', matchId: 'girocard', icon: <CreditCard className="w-5 h-5" /> },
  { id: 't2', text: 'Lastschrift (Bankeinzug)', matchId: 'lastschrift', icon: <Building className="w-5 h-5" /> },
  { id: 't3', text: 'PayPal', matchId: 'paypal', icon: <Globe className="w-5 h-5 text-blue-600" /> },
  { id: 't4', text: 'Klarna / Payment-Dienstleister', matchId: 'klarna', icon: <Banknote className="w-5 h-5 text-pink-500" /> },
  { id: 't5', text: 'Klassischer Kauf auf Rechnung', matchId: 'rechnung', icon: <Banknote className="w-5 h-5 text-slate-600" /> },
  { id: 't6', text: 'Prepaid-Kreditkarte', matchId: 'prepaid', icon: <CreditCard className="w-5 h-5 text-orange-500" /> },
  { id: 't7', text: 'Internationale Debitkarte', matchId: 'visa_debit', icon: <CreditCard className="w-5 h-5 text-blue-500" /> },
];

const definitions: Item[] = [
  { id: 'd1', matchId: 'girocard', text: `Was ist das?\nZahlung mit der Debitkarte deiner Bank im Geschäft; online nur selten nutzbar. Der Betrag wird zeitnah direkt von deinem Konto abgebucht.\n\nVorteile:\n- Einfach und in Deutschland weit verbreitet\n- Keine Verschuldung möglich (direkte Abbuchung)\n\nNachteile:\n- Online oft nicht akzeptiert\n- Im Ausland häufig kaum nutzbar` },
  { id: 'd2', matchId: 'lastschrift', text: `Was ist das?\nDu erlaubst dem Händler, den Betrag später direkt von deinem Konto abzubuchen. Eine schriftliche oder digitale Erlaubnis ist dafür nötig.\n\nVorteile:\n- Bequem, keine Karte erforderlich\n- Unberechtigte Abbuchungen kannst du in der Regel innerhalb von 8 Wochen zurückgeben\n\nNachteile:\n- Konto muss gedeckt sein\n- Abbuchungen unbedingt auf dem Kontoauszug kontrollieren` },
  { id: 'd3', matchId: 'paypal', text: `Was ist das?\nDigitale Geldbörse für Online-Zahlungen, verbunden mit deinem Konto oder einer Karte; Nutzung in der Regel ab 18 und nach Verifizierung.\n\nVorteile:\n- Käuferschutz bei Problemen\n- Keine Weitergabe deiner Kontodaten an den Shop\n- Schnell und weit verbreitet im Internet\n\nNachteile:\n- Altersbeschränkung/Account notwendig\n- Teilweise Gebühren (vor allem für Händler)` },
  { id: 'd4', matchId: 'klarna', text: `Was ist das?\nDer Dienst bezahlt den Shop sofort, du begleichst den Betrag später beim Dienst – oft mit Bonitätsprüfung.\n\nVorteile:\n- Versand kann sofort erfolgen\n- Später zahlen oder Ratenzahlung teils möglich\n\nNachteile:\n- In der Regel ab 18 und mit Bonitätsprüfung\n- Zahlungsverzug führt schnell zu Mahnkosten/negativen Einträgen` },
  { id: 'd5', matchId: 'rechnung', text: `Was ist das?\nDie Ware kommt zuerst; du überweist den Betrag eigenständig innerhalb einer vorgegebenen Frist (z. B. 14 Tage).\n\nVorteile:\n- Sehr sicher: Erst prüfen, dann bezahlen\n- Keine sensiblen Kontodaten nötig beim Einkauf\n\nNachteile:\n- Fristversäumnis führt zu Mahngebühren\n- Nicht immer für Neukundinnen/Neukunden verfügbar` },
  { id: 'd6', matchId: 'prepaid', text: `Was ist das?\nKartenlösung, die wie eine Kreditkarte funktioniert, aber vorher mit Guthaben aufgeladen werden muss.\n\nVorteile:\n- Online und im Ausland wie eine Kreditkarte nutzbar\n- Kein Verschuldungsrisiko (es kann nur vorhandenes Guthaben genutzt werden)\n\nNachteile:\n- Vorab-Aufladung erforderlich\n- Manche Kautionen (z. B. Hotel, Mietwagen) funktionieren damit nicht zuverlässig` },
  { id: 'd7', matchId: 'visa_debit', text: `Was ist das?\nInternational nutzbare Debitkarte, mit deinem Girokonto verbunden. Zahlungen werden zeitnah direkt vom Konto abgebucht; online und im Ausland in vielen Shops einsetzbar.\n\nVorteile:\n- Breite Akzeptanz online und auf Reisen\n- Direkte Abbuchung vom Konto (gute Kostenkontrolle)\n- Teilweise Rückbuchungs-/Schutzmöglichkeiten über das Kartennetz\n\nNachteile:\n- Kein Kreditrahmen (nur verfügbares Guthaben nutzbar)\n- Mitunter nicht ganz so breit akzeptiert wie klassische Kreditkarten` },
];

export const PaymentMethodsPage: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // Stores matchIds
  const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);
  
  const { completeModule } = useGameStore();
  const navigate = useNavigate();

  // Shuffle definitions once on mount
  const [shuffledDefs, setShuffledDefs] = useState<Item[]>([]);
  useEffect(() => {
    setShuffledDefs([...definitions].sort(() => Math.random() - 0.5));
  }, []);

  const handleTermClick = (id: string) => {
    if (matchedPairs.includes(terms.find(t => t.id === id)?.matchId || '')) return;
    setSelectedTerm(id);
    setWrongAttempt(null);
  };

  const handleDefClick = (id: string) => {
    if (!selectedTerm) return;
    
    const term = terms.find(t => t.id === selectedTerm);
    const def = definitions.find(d => d.id === id);
    
    if (term && def) {
      if (term.matchId === def.matchId) {
        setMatchedPairs([...matchedPairs, term.matchId]);
        setSelectedTerm(null);
      } else {
        setWrongAttempt(id);
        setTimeout(() => setWrongAttempt(null), 1000);
      }
    }
  };

  const handleFinish = () => {
    completeModule('payment_methods');
    navigate('/offline');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Training: Wie bezahle ich?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Verbinde den Begriff links mit der korrekten fachlichen Erklärung rechts.
          Die Erklärungen enthalten: Was ist das?, Vorteile und Nachteile.
          <br/>Klicke zuerst auf den Begriff, dann auf die Erklärung.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Column: Terms */}
        <div className="space-y-3 md:sticky md:top-24">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2 pl-2">Zahlungsart</h3>
          {terms.map((term) => {
            const isMatched = matchedPairs.includes(term.matchId);
            const isSelected = selectedTerm === term.id;
            
            return (
              <button
                key={term.id}
                onClick={() => handleTermClick(term.id)}
                disabled={isMatched}
                className={clsx(
                  "w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all relative",
                  isMatched ? "border-emerald-100 bg-emerald-50/50 opacity-60 saturate-0" : 
                  isSelected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200 z-10 shadow-md" : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
                )}
              >
                <div className={clsx("p-2 rounded-lg transition-colors", isMatched ? "bg-slate-100" : "bg-slate-50")}>
                  {term.icon}
                </div>
                <span className={clsx("font-bold text-lg", isMatched && "line-through decoration-slate-400 text-slate-500")}>
                   {term.text}
                </span>
                {isMatched && <div className="absolute right-4 text-emerald-600"><Link2 className="w-5 h-5" /></div>}
                {isSelected && <div className="absolute -right-3 bg-brand-500 w-6 h-6 rotate-45 transform origin-center"></div>} 
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2 pl-2">Fachliche Erklärung</h3>
          {shuffledDefs.map((def) => {
             const isMatched = matchedPairs.includes(def.matchId);
             const isWrong = wrongAttempt === def.id;

             return (
               <button
                 key={def.id}
                 onClick={() => handleDefClick(def.id)}
                 disabled={isMatched}
                 className={clsx(
                   "w-full p-4 rounded-xl border-2 text-left transition-all h-full min-h-[140px] flex",
                   isMatched ? "border-emerald-100 bg-emerald-50/50 opacity-60 text-slate-400" : 
                   isWrong ? "border-red-500 bg-red-50 animate-shake" : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
                 )}
               >
                 <div className="text-sm leading-relaxed whitespace-pre-line">
                   {def.text}
                 </div>
               </button>
             );
          })}
        </div>
      </div>

      {matchedPairs.length === terms.length && (
        <div className="mt-12 text-center animate-fade-in bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
           <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-700 rounded-full mb-6">
             <ShieldCheck className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-bold mb-2">Alles richtig zugeordnet!</h3>
           <p className="text-slate-600 mb-8 text-lg">
             Du kennst jetzt die Unterschiede zwischen echten Rechnungen, Dienstleistern wie Klarna und der klassischen Lastschrift.
             Zeit, dieses Wissen anzuwenden.
           </p>
           <button
              onClick={handleFinish}
              className="px-10 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Weiter zum Einkauf (Offline) <ArrowRight className="ml-2 w-6 h-6" />
            </button>
        </div>
      )}
    </div>
  );
};
