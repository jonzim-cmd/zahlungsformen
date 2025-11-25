import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, FileText, Wallet, Check, Info } from 'lucide-react';

export const TransferPage: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro');
  const { balance, updateBalance, completeModule } = useGameStore();
  const navigate = useNavigate();
  const [depositReturned, setDepositReturned] = useState(false);

  // Form State
  const [recipient, setRecipient] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const invoiceData = {
    recipient: "DJ Tobi Entertainment",
    iban: "DE89 1234 5678 0000 1111 22",
    bic: "GENODED1MUC",
    amount: "80,00",
    ref: "RE-2024-99"
  };

  const handleReturnDeposit = () => {
    if (!depositReturned) {
      updateBalance(50);
      setDepositReturned(true);
      setStep('form');
    }
  };

  const handleSubmit = () => {
    const newErrors = [];
    
    if (recipient.toLowerCase() !== invoiceData.recipient.toLowerCase()) newErrors.push("Empfänger stimmt nicht.");
    // Allow IBAN with or without spaces
    const cleanIbanInput = iban.replace(/\s/g, '');
    const cleanIbanTarget = invoiceData.iban.replace(/\s/g, '');
    if (cleanIbanInput !== cleanIbanTarget) newErrors.push("IBAN ist falsch.");
    
    if (amount.replace(',', '.') !== "80.00" && amount.replace(',', '.') !== "80") newErrors.push("Betrag stimmt nicht.");
    
    if (!reference.includes("RE-2024-99")) newErrors.push("Verwendungszweck fehlt oder falsch (Rechnungsnummer!).");

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      if (balance < 80) {
        setErrors(["Nicht genug Guthaben auf dem Konto!"]);
      } else {
        updateBalance(-80);
        completeModule('transfer');
        setStep('success');
      }
    }
  };

  const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <span className="relative inline-flex items-center group">
      <Info className="w-4 h-4 text-slate-500 cursor-help" />
      <span
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] font-sans text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        style={{ transitionDelay: '300ms' }}
      >
        {text}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-slate-800" />
      </span>
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-8">
      {step === 'intro' && (
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Die Party ist vorbei!</h2>
            <p className="text-slate-600 mb-6 text-lg">
              Es war ein voller Erfolg. Der Hausmeister war zufrieden und gibt dir die Kaution zurück.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-8">
              <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Aktueller Kontostand</div>
              <div className="text-3xl font-mono font-bold text-slate-800">{balance.toFixed(2)} €</div>
            </div>
            <button 
              onClick={handleReturnDeposit}
              className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition flex items-center justify-center"
            >
              <Wallet className="mr-2" /> Kaution einzahlen (+50,00 €)
            </button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Story / Context */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-2">DJ für die Party</h3>
              <p className="text-slate-600">
                Du möchtest einen DJ engagieren, damit die Party so richtig gut wird.
                Die Rechnung ist eingetroffen – nun musst du sie bezahlen. Übertrage
                dafür die Daten aus der Rechnung korrekt in den Überweisungsträger.
              </p>
            </div>
          </div>
          {/* Invoice View */}
          <div className="bg-white p-8 shadow-sm border border-slate-200 min-h-[400px] text-sm relative paper-texture">
             <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%)'}}></div>
             <div className="border-b-2 border-slate-800 pb-4 mb-6">
               <h3 className="font-black text-xl uppercase tracking-widest">Rechnung</h3>
               <p className="text-slate-500">Original</p>
             </div>
             
             <div className="mb-8">
               <p className="font-bold text-lg">DJ Tobi Entertainment</p>
               <p>Musikstraße 1, 10115 Berlin</p>
             </div>

             <div className="mb-8">
               <p className="font-bold">An: Klasse 10b</p>
               <p>Rechnungs-Nr.: <span className="font-mono bg-yellow-100 px-1">RE-2024-99</span></p>
               <p>Datum: {new Date().toLocaleDateString()}</p>
             </div>

             <table className="w-full mb-6">
               <thead>
                 <tr className="border-b border-slate-300 text-left">
                   <th className="py-2">Beschreibung</th>
                   <th className="py-2 text-right">Betrag</th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="border-b border-slate-100">
                   <td className="py-2">DJ Service (4 Stunden)</td>
                   <td className="py-2 text-right">80,00 €</td>
                 </tr>
               </tbody>
               <tfoot>
                 <tr className="font-bold text-lg">
                   <td className="py-4">Gesamtbetrag</td>
                   <td className="py-4 text-right">80,00 €</td>
                 </tr>
               </tfoot>
             </table>

             <div className="bg-slate-50 p-4 text-xs space-y-1 rounded">
               <p>Bitte überweisen Sie den Betrag sofort auf folgendes Konto:</p>
               <p>Empfänger: <strong>{invoiceData.recipient}</strong></p>
               <p>IBAN: <strong>{invoiceData.iban}</strong></p>
               <p>BIC: {invoiceData.bic}</p>
             </div>
          </div>

          {/* SEPA Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <FileText className="text-brand-600" /> Überweisungsträger
               </h3>
               <p className="text-sm text-slate-500 mb-6">
                 Übertrage die Daten exakt von der Rechnung in das Formular.
               </p>

               <div className="bg-[#ffefef] p-4 border border-red-200 rounded-lg space-y-4 text-sm font-mono text-slate-700 relative">
                  {/* Red Corner */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-500 rounded-l-lg"></div>

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans text-red-600 uppercase font-bold">Begünstigter (Empfänger)</label>
                      <Tooltip text="Name oder Firmenname des Empfängers laut Rechnung." />
                    </div>
                    <input 
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="w-full bg-white border border-red-200 p-2" 
                    />
                  </div>

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans text-red-600 uppercase font-bold">IBAN</label>
                      <Tooltip text="IBAN des Empfängers exakt übernehmen (Leerzeichen egal)." />
                    </div>
                    <input 
                      value={iban}
                      onChange={e => setIban(e.target.value)}
                      className="w-full bg-white border border-red-200 p-2" 
                    />
                  </div>

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans text-red-600 uppercase font-bold">BIC (Optional)</label>
                      <Tooltip text="Optional: Nur eintragen, wenn auf der Rechnung angegeben." />
                    </div>
                    <input 
                      value={bic}
                      onChange={e => setBic(e.target.value)}
                      className="w-1/2 bg-white border border-red-200 p-2" 
                    />
                  </div>

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans text-red-600 uppercase font-bold">Betrag (EUR)</label>
                      <Tooltip text="Betrag in Euro wie auf der Rechnung (Komma oder Punkt)." />
                    </div>
                    <input 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-1/2 bg-white border border-red-200 p-2 text-right" 
                    />
                  </div>

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans text-red-600 uppercase font-bold">Verwendungszweck</label>
                      <Tooltip text="Verwendungszweck kurz halten, z. B. die aufgedruckte Referenz." />
                    </div>
                    <input 
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      maxLength={27}
                      className="w-full bg-white border border-red-200 p-2" 
                    />
                    <input 
                      disabled
                      className="w-full bg-slate-50 border border-red-200 p-2 mt-1 opacity-50" 
                    />
                  </div>
               </div>

               {errors.length > 0 && (
                 <div className="bg-red-50 text-red-600 p-4 rounded mt-4 text-sm">
                   <ul className="list-disc list-inside">
                     {errors.map((e, i) => <li key={i}>{e}</li>)}
                   </ul>
                 </div>
               )}

               <button 
                 onClick={handleSubmit}
                 className="w-full mt-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md"
               >
                 Überweisung absenden
               </button>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Rechnung bezahlt!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Das Geld ist unterwegs an den DJ. <br/>
            Dein Kontostand beträgt jetzt: <strong>{balance.toFixed(2)} €</strong>.
          </p>
          <button 
            onClick={() => navigate('/reflection')}
            className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition flex items-center mx-auto"
          >
            Zum Abschluss & Kontoauszug <ArrowRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};
