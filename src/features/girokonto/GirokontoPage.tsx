import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Check, X, Building2, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

type BankOption = {
  id: string;
  name: string;
  monthlyFee: number;
  cardType: string;
  interest: number;
  dispoInterest: number;
  features: string[];
  isBest: boolean;
  description: string;
};

const banks: BankOption[] = [
  {
    id: 'filial_bank',
    name: 'Stadtsparkasse (Filiale)',
    monthlyFee: 0.00, 
    cardType: 'Girocard (EC)',
    interest: 0.01,
    dispoInterest: 11.5,
    features: ['Persönlicher Ansprechpartner', 'Viele Geldautomaten', 'Kostenloses Jugendkonto'],
    isBest: true, 
    description: "Klassische Bank mit Filialen vor Ort. Du kannst hingehen und mit Menschen sprechen."
  },
  {
    id: 'neo_bank',
    name: 'Smartphone Bank (App only)',
    monthlyFee: 0.00,
    cardType: 'Debit Visa',
    interest: 2.0, 
    dispoInterest: 9.9,
    features: ['Nur per App', 'Keine Filialen', 'Weltweit kostenlos zahlen'],
    isBest: true, 
    description: "Moderne Bank ohne Filialen. Alles läuft über das Smartphone. Oft gibt es Zinsen aufs Guthaben."
  },
  {
    id: 'expensive_bank',
    name: 'Kommerzbank Premium',
    monthlyFee: 4.90,
    cardType: 'Gold Kreditkarte',
    interest: 0.0,
    dispoInterest: 14.0,
    features: ['Reiseversicherung', 'Status-Symbol'],
    isBest: false,
    description: "Eine Bank für gut verdienende Erwachsene. Für Schüler unnötig teuer."
  }
];

const quizQuestions = [
  {
    id: 1,
    question: "Wann gilt der 'Taschengeldparagraph' (§ 110 BGB) NICHT mehr?",
    isMultipleChoice: true,
    options: [
      { text: "Wenn du dir vom gesparten Geld ein neues Videospiel kaufst.", correct: false },
      { text: "Wenn du einen Handyvertrag mit monatlicher Grundgebühr abschließt.", correct: true },
      { text: "Wenn du dir eine Cola am Kiosk kaufst.", correct: false }
    ],
    explanation: "Verträge mit wiederkehrenden Kosten (Abos) oder Ratenzahlungen sind 'schwebend unwirksam'. Sie brauchen IMMER die Zustimmung der Eltern, egal wie reich du bist."
  },
  {
    id: 2,
    question: "Was bedeutet 'Haben-Zinsen'?",
    isMultipleChoice: true,
    options: [
      { text: "Die Bank leiht dir Geld und du musst dafür Zinsen zahlen.", correct: false },
      { text: "Du hast Geld auf dem Konto und die Bank zahlt DIR dafür Zinsen.", correct: true }
    ],
    explanation: "Genau! 'Haben' = Du hast es. Die Bank arbeitet mit deinem Geld und belohnt dich dafür. 'Soll-Zinsen' zahlst du, wenn du im Minus (Soll) bist."
  },
  {
    id: 3,
    question: "Du möchtest online etwas bestellen, das 500 € kostet. Dein Kontostand: 200 €. Was passiert?",
    isMultipleChoice: true,
    options: [
      { text: "Die Bank leiht mir automatisch den Rest (Dispo).", correct: false },
      { text: "Die Zahlung wird abgelehnt, weil ich als Minderjähriger keinen Dispo habe.", correct: true },
      { text: "Die Bank ruft meine Eltern an.", correct: false }
    ],
    explanation: "Richtig. Jugendkonten werden auf Guthabenbasis geführt. Du kannst nicht ins Minus rutschen (Überziehungsschutz)."
  },
  {
    id: 4,
    question: "Was ist eine TAN (Transaktionsnummer) beim Online-Banking?",
    isMultipleChoice: true,
    options: [
      { text: "Ein Passwort, das ich mir selbst ausdenke.", correct: false },
      { text: "Ein Einmal-Code, der z.B. auf mein Handy geschickt wird, um eine Überweisung freizugeben.", correct: true }
    ],
    explanation: "Die TAN ist wie eine digitale Unterschrift für genau EINE Aktion. Gib sie niemals an andere weiter!"
  },
  {
    id: 5,
    question: "Wie ist eine deutsche IBAN aufgebaut?",
    isMultipleChoice: true,
    options: [
      { text: "Nur Zahlen, 10 Stellen lang.", correct: false },
      { text: "DE + Prüfziffer + Bankleitzahl + Kontonummer (insgesamt 22 Stellen).", correct: true },
      { text: "Name der Bank + Kontonummer.", correct: false }
    ],
    explanation: "Die IBAN ist weltweit eindeutig. In Deutschland immer 22 Stellen beginnend mit DE."
  }
];

export const GirokontoPage: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'learn' | 'compare' | 'legal' | 'success'>('intro');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  
  const { completeModule, setBankDetails } = useGameStore();
  const navigate = useNavigate();

  const generateIban = (bankName: string) => {
    const bankCode = bankName.includes('Sparkasse') ? '70050000' : '10010010';
    const accountNum = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
    return `DE99 ${bankCode.substring(0, 4)} ${bankCode.substring(4)} ${accountNum.substring(0, 4)} ${accountNum.substring(4)} ${accountNum.substring(8)}`;
  };

  const handleBankConfirm = () => {
    const bank = banks.find(b => b.id === selectedBank);
    if (bank?.id === 'expensive_bank') {
      alert('Diese Bank kostet fast 60€ im Jahr an Gebühren! Als Schüler gibt es kostenlose Alternativen. Wähle besser.');
      return;
    }
    setStep('legal');
  };

  const handleFinish = () => {
    const bank = banks.find(b => b.id === selectedBank);
    if (bank) {
      const iban = generateIban(bank.name);
      setBankDetails(iban, 'GENODED1MUC', bank.name);
    }
    completeModule('girokonto');
    navigate('/payment-methods');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      {step === 'intro' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Schritt 1: Dein eigenes Konto</h2>
          <p className="text-slate-600 mb-6">
            Deine Eltern haben dir bisher das Taschengeld bar gegeben. Für die Party-Planung und für die Zukunft brauchst du aber ein <strong>Girokonto</strong>.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg flex gap-4 mb-8">
            <Info className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Warum eigentlich?</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Bargeldloses Bezahlen (im Laden & Online)</li>
                <li>Geld empfangen (z.B. später Gehalt, Geldgeschenke)</li>
                <li>Daueraufträge (z.B. Handyvertrag)</li>
              </ul>
            </div>
          </div>
          <button 
            onClick={() => setStep('learn')}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
          >
            Begriffe verstehen
          </button>
        </div>
      )}

      {step === 'learn' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">Kurz erklärt: Bank-Deutsch</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition cursor-default group">
              <h3 className="font-bold text-lg text-brand-600 mb-2 group-hover:scale-105 transition-transform origin-left">Girocard (EC)</h3>
              <p className="text-sm text-slate-600">
                Die deutsche Standard-Karte. Das Geld wird <strong>sofort</strong> vom Konto abgebucht. Funktioniert fast überall in Deutschland, aber selten online im Ausland (keine Kreditkarte!).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition cursor-default group">
              <h3 className="font-bold text-lg text-purple-600 mb-2 group-hover:scale-105 transition-transform origin-left">IBAN</h3>
              <p className="text-sm text-slate-600">
                Deine <strong>internationale Kontonummer</strong>. Sie hat in Deutschland immer <strong>22 Stellen</strong> und beginnt mit DE.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition cursor-default group">
              <h3 className="font-bold text-lg text-green-600 mb-2 group-hover:scale-105 transition-transform origin-left">Zinsen</h3>
              <p className="text-sm text-slate-600">
                <strong>Haben-Zinsen:</strong> Die Bank zahlt DIR Geld für dein Guthaben.<br/>
                <strong>Soll-Zinsen:</strong> DU zahlst der Bank Geld für Schulden (Dispo).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition cursor-default group">
              <h3 className="font-bold text-lg text-red-600 mb-2 group-hover:scale-105 transition-transform origin-left">Dispo (Kredit)</h3>
              <p className="text-sm text-slate-600">
                Die Erlaubnis, das Konto zu überziehen (ins Minus zu gehen). <strong>Achtung:</strong> Für unter 18-Jährige verboten!
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => setStep('compare')}
              className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition flex items-center mx-auto"
            >
              Alles klar, Bank wählen <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'compare' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Welche Bank passt zu dir?</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto">
            Du hast die Wahl. Achte auf Gebühren und Leistungen. Da du Schüler bist, solltest du nichts für die Kontoführung zahlen müssen.
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {banks.map(bank => (
              <div 
                key={bank.id}
                onClick={() => setSelectedBank(bank.id)}
                className={clsx(
                  "p-6 rounded-xl border-2 cursor-pointer transition-all relative flex flex-col",
                  selectedBank === bank.id 
                    ? "border-brand-500 bg-brand-50 shadow-lg scale-105 z-10" 
                    : "border-slate-200 bg-white hover:border-brand-200 hover:shadow-md"
                )}
              >
                {selectedBank === bank.id && (
                  <div className="absolute -top-3 -right-3 bg-brand-500 text-white p-1 rounded-full shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                )}
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="text-slate-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{bank.name}</h3>
                <p className="text-xs text-slate-500 mb-4 min-h-[3rem]">{bank.description}</p>
                
                <div className="text-2xl font-bold mb-1 text-slate-800">
                  {bank.monthlyFee === 0 ? '0,00 €' : `${bank.monthlyFee.toFixed(2).replace('.',',')} €`}
                </div>
                <div className="text-xs text-slate-500 mb-4 uppercase tracking-wide">pro Monat</div>

                <div className="space-y-2 text-sm text-slate-600 flex-1">
                   <div className="flex justify-between border-b pb-1">
                     <span>Karte:</span>
                     <span className="font-semibold">{bank.cardType}</span>
                   </div>
                   <div className="flex justify-between border-b pb-1">
                     <span>Guthabenzins:</span>
                     <span className="font-semibold text-green-600">{bank.interest}%</span>
                   </div>
                   <div className="mt-2">
                     {bank.features.map((f, i) => (
                       <div key={i} className="flex items-start mt-1 text-xs">
                         <Check className="w-3 h-3 mr-1 text-green-500 mt-0.5 flex-shrink-0" /> {f}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button 
              onClick={handleBankConfirm}
              disabled={!selectedBank}
              className="w-full max-w-md py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              Konto eröffnen
            </button>
          </div>
        </div>
      )}

      {step === 'legal' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6">Der große Check: Bist du fit fürs Konto?</h2>
          <p className="text-slate-600 mb-6">
            Bevor die Bank dein Konto eröffnet, musst du beweisen, dass du die Regeln kennst.
          </p>
          
          <div className="space-y-8">
            {quizQuestions.map((q) => {
              const userAnswer = quizAnswers[q.id];
              const hasAnswered = userAnswer !== undefined;
              
              return (
                <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
                    <p className="font-medium text-lg mb-4">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => {
                        const isSelected = userAnswer === idx;
                        let btnClass = "w-full text-left p-4 border rounded-xl transition-all relative ";
                        
                        if (!hasAnswered) {
                            btnClass += "hover:bg-slate-50 border-slate-300 hover:border-brand-300";
                        } else {
                            if (opt.correct) {
                              btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500";
                            } else if (isSelected && !opt.correct) {
                              btnClass += "bg-red-50 border-red-500 text-red-900 opacity-70";
                            } else {
                              btnClass += "opacity-40 border-slate-200 bg-slate-50";
                            }
                        }

                        return (
                          <button 
                            key={idx}
                            disabled={hasAnswered}
                            onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: idx}))}
                            className={btnClass}
                          >
                            <div className="flex items-center">
                              {hasAnswered && opt.correct && <Check className="w-5 h-5 mr-3 text-emerald-600" />}
                              {hasAnswered && isSelected && !opt.correct && <X className="w-5 h-5 mr-3 text-red-600" />}
                              {(!hasAnswered || (!opt.correct && !isSelected)) && <div className="w-5 h-5 mr-3" />}
                              <span>{opt.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {hasAnswered && (
                      <div className="mt-4 text-sm bg-blue-50 text-blue-900 p-4 rounded-lg border border-blue-100 flex gap-3">
                        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        {q.explanation}
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {Object.keys(quizAnswers).length === quizQuestions.length && (
            <button 
              onClick={handleFinish}
              className="w-full mt-8 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition animate-bounce-small shadow-xl text-lg"
            >
              Test bestanden! Konto jetzt erstellen
            </button>
          )}
        </div>
      )}

    </div>
  );
};
