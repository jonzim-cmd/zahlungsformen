import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, ArrowRight, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export const OfflineShoppingPage: React.FC = () => {
  const [step, setStep] = useState<'receipt' | 'receipt_corrected' | 'cash_form' | 'finish'>('receipt');
  const { userFirstName, updateBalance, addToInventory, completeModule } = useGameStore();
  const navigate = useNavigate();

  // Receipt State
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [receiptErrorFound, setReceiptErrorFound] = useState(false);

  // Cash Form State
  const [formAmount, setFormAmount] = useState('');
  const [formText, setFormText] = useState('');
  const [formFrom, setFormFrom] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formPlace, setFormPlace] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formNetto, setFormNetto] = useState('');
  const [formTax, setFormTax] = useState('');
  const [formTotal, setFormTotal] = useState('');
  const [signed, setSigned] = useState(false);
  const [ustChecked, setUstChecked] = useState(false);

  const [showMathTip, setShowMathTip] = useState(false);

  const receiptItems = [
    { id: 1, name: 'Cola 1,5L', qty: 2, price: 1.79, total: 3.58 },
    { id: 2, name: 'Chips Paprika', qty: 3, price: 1.99, total: 5.97 },
    { id: 3, name: 'Baguette', qty: 5, price: 1.20, total: 6.00 },
    { id: 4, name: 'Pfand Mehrweg', qty: 10, price: 0.15, total: 1.50, isError: true }, 
    { id: 5, name: 'Servietten', qty: 1, price: 2.50, total: 2.50 },
  ];

  const handleLineClick = (id: number, isError: boolean) => {
    if (step !== 'receipt') return;
    setSelectedLine(id);
    if (isError) {
      setReceiptErrorFound(true);
      setTimeout(() => setStep('receipt_corrected'), 1500);
    }
  };

  const handleCashSubmit = () => {
    const errors = [];
    if (!formAmount.includes('50')) errors.push("Betrag oben muss 50 sein.");
    
    if (!formFrom.toLowerCase().includes(userFirstName.toLowerCase())) errors.push("Falscher Geldgeber (von). Du zahlst die Kaution.");
    if (!formReason.toLowerCase().includes('kaution')) errors.push("Verwendungszweck ist unklar.");
    if (!signed) errors.push("Unterschrift fehlt.");
    
    // Calculation check
    const net = parseFloat(formNetto.replace(',','.'));
    const tax = parseFloat(formTax.replace(',','.'));
    const tot = parseFloat(formTotal.replace(',','.'));
    
    if (isNaN(net) || isNaN(tax) || isNaN(tot)) {
      errors.push("Bitte fülle die Zahlenfelder (Netto, MwSt, Gesamt) aus.");
    } else {
      if (Math.abs(tot - 50) > 0.1) errors.push("Gesamtbetrag muss 50,00 EUR sein.");
      if (Math.abs(net + tax - tot) > 0.1) errors.push("Netto + MwSt ergibt nicht den Gesamtbetrag.");
      // Allow tolerance
      if (Math.abs(net * 0.19 - tax) > 0.1 && Math.abs(net - 42.02) > 0.05) errors.push("Die Steuer stimmt nicht (19%).");
    }

    if (!ustChecked) errors.push("Bitte hake 19% MwSt an.");

    if (errors.length > 0) {
      alert('Korrekturen nötig:\n- ' + errors.join('\n- '));
      return;
    }

    setStep('finish');
    completeModule('offline');
    updateBalance(-18.35);
    updateBalance(-50);
    addToInventory('Snacks & Getränke');
    addToInventory('Raumschlüssel');
  };

  const handleFinish = () => {
    navigate('/online');
  };

  const renderReceipt = (corrected = false) => {
    const items = corrected ? receiptItems.map(i => i.isError ? { ...i, qty: 2, total: 0.30 } : i) : receiptItems;
    const sum = items.reduce((acc, curr) => acc + curr.total, 0);

    return (
      <div className="bg-white p-6 w-full max-w-xs mx-auto shadow-xl receipt-paper text-sm font-mono relative mb-8 rotate-1 transform transition-transform hover:scale-105">
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl">SuperMarkt</h3>
          <p>Musterstraße 12, 80331 München</p>
          <p>Tel: 089-12345678</p>
        </div>
        <div className="border-b-2 border-dashed border-slate-300 my-2"></div>
        <table className="w-full mb-4">
          <thead>
            <tr className="text-left">
              <th>Art</th>
              <th className="text-right">EUR</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => handleLineClick(item.id, !!item.isError)}
                className={clsx(
                  "cursor-pointer transition-colors p-1 rounded",
                  step === 'receipt' && "hover:bg-yellow-100",
                  selectedLine === item.id && !item.isError && "bg-red-100",
                  selectedLine === item.id && item.isError && "bg-green-100"
                )}
              >
                <td>
                  {item.qty} x {item.name}<br />
                  <span className="text-xs text-slate-500">@{item.price.toFixed(2)}</span>
                </td>
                <td className="text-right align-top">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t-2 border-dashed border-slate-300 my-2 pt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>SUMME</span>
            <span>{sum.toFixed(2)} EUR</span>
          </div>
        </div>
        <div className="text-center mt-6 text-xs">
          <p>Es bediente Sie: Herr Kassierer</p>
          <p>{new Date().toLocaleDateString()} 14:30</p>
          <p>Vielen Dank für Ihren Einkauf!</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-50" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in py-8 px-4">
      
      {step === 'receipt' && (
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 space-y-6 pt-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
               <ShoppingBag className="w-8 h-8 text-brand-600" /> Der Einkauf
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Du warst im Supermarkt, um Getränke und Snacks für die Party zu kaufen. 
              An der Kasse hast du bezahlt, aber beim Rausgehen schaust du dir den Kassenbon nochmal genauer an.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <h3 className="font-bold text-yellow-800 mb-2">Deine Aufgabe:</h3>
              <p className="text-yellow-800">
                Irgendetwas stimmt hier nicht!
                <br/><br/>
                👉 <strong>Klicke auf die fehlerhafte Zeile im Kassenbon.</strong>
              </p>
            </div>
            {selectedLine && !receiptErrorFound && (
              <div className="text-red-500 font-bold animate-pulse bg-red-50 p-4 rounded-lg inline-block">
                Nein, das ist korrekt. Schau dir die Mengen (Anzahl) genau an!
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-center bg-slate-100 p-12 rounded-3xl shadow-inner">
            {renderReceipt(false)}
          </div>
        </div>
      )}

      {step === 'receipt_corrected' && (
        <div className="text-center space-y-8 max-w-lg mx-auto pt-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-small">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">Fehler gefunden!</h2>
          <p className="text-slate-600 text-lg">
            Der Kassierer hatte versehentlich 10x Pfand getippt. Er entschuldigt sich und gibt dir das Geld zurück.
            <br/><br/>
            Neuer korrekter Betrag: <strong className="text-emerald-600 text-2xl">18,35 €</strong>.
          </p>
          <button 
            onClick={() => setStep('cash_form')}
            className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg transition-all text-lg"
          >
            Weiter zur Raum-Kaution
          </button>
        </div>
      )}

      {step === 'cash_form' && (
        <div className="space-y-8">
          
          {/* TOP: Instructions & Helper */}
          <div className="space-y-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Die Kaution</h2>
                    <p className="text-slate-600 text-sm">
                      Du möchtest für deinen Geburtstag einen Raum mieten, um dort deine Party zu feiern. Der Hausmeister verlangt <strong>50,00 €</strong> Kaution in Bar. 
                      Er hat keine Brille dabei und bittet dich, die Quittung für ihn auszufüllen.
                    </p>
                    <p className="mt-2 text-sm text-blue-800 font-medium">
                      Achtung: Der Hausmeister vermietet gewerblich. Er muss 19% USt ausweisen.
                    </p>
                  </div>
                  
                  {/* Accordion Math Helper */}
                  <div className="w-full md:w-auto">
                    <button 
                      onClick={() => setShowMathTip(!showMathTip)}
                      className="flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition text-slate-700 font-medium w-full md:w-auto justify-between"
                    >
                      <Calculator className="w-4 h-4" /> 
                      {showMathTip ? 'Rechenhilfe verbergen' : 'Rechenhilfe anzeigen'}
                      {showMathTip ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </button>
                    
                    {showMathTip && (
                      <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 animate-fade-in max-w-md">
                        <p className="mb-1">50,00 € sind der <strong>Bruttobetrag</strong>.</p>
                        <p className="font-mono text-xs">Brutto / 1,19 = Netto</p>
                        <p className="font-mono text-xs">Brutto - Netto = Steuer</p>
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </div>

          {/* BOTTOM: The Receipt Form */}
          <div className="flex justify-center">
            <div className="bg-[#fffde7] p-8 md:p-12 rounded shadow-2xl border border-slate-300 relative max-w-4xl w-full">
              
              <div className="flex justify-between items-start mb-10 border-b-4 border-slate-800 pb-4">
                <h3 className="text-4xl font-black text-slate-800 uppercase tracking-[0.2em]">Quittung</h3>
                <div className="text-right opacity-50">
                  <div className="text-xs font-bold mb-1">Nr.</div>
                  <div className="font-mono">#_________</div>
                </div>
              </div>

              <div className="space-y-8 font-mono text-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-32 font-bold text-right text-sm text-slate-500 uppercase tracking-wider">Betrag</label>
                  <div className="relative flex-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-40 p-2 border-b-2 border-dotted border-slate-400 bg-transparent focus:outline-none focus:border-brand-500 font-handwriting text-2xl font-bold text-slate-900"
                      placeholder="0,00"
                    />
                    <span className="font-bold text-xl">EUR</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-32 font-bold text-right text-sm text-slate-500 uppercase tracking-wider">in Worten</label>
                  <input 
                    type="text" 
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Betrag in Worten"
                    className="flex-1 p-2 border-b-2 border-dotted border-slate-400 bg-transparent focus:outline-none focus:border-brand-500 font-handwriting text-xl text-slate-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-32 font-bold text-right text-sm text-slate-500 uppercase tracking-wider">von</label>
                  <input 
                    type="text" 
                    value={formFrom}
                    onChange={(e) => setFormFrom(e.target.value)}
                    placeholder="Vorname Nachname"
                    className="flex-1 p-2 border-b-2 border-dotted border-slate-400 bg-transparent focus:outline-none focus:border-brand-500 font-handwriting text-xl text-slate-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-32 font-bold text-right text-sm text-slate-500 uppercase tracking-wider">für</label>
                  <input 
                    type="text" 
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="Verwendungszweck"
                    className="flex-1 p-2 border-b-2 border-dotted border-slate-400 bg-transparent focus:outline-none focus:border-brand-500 font-handwriting text-xl text-slate-900"
                  />
                </div>

                {/* Calculation Section */}
                <div className="border-t-2 border-slate-300 pt-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-dotted border-slate-400 pb-1">
                         <span className="text-sm font-bold text-slate-600">Nettobetrag:</span>
                         <div className="flex items-center">
                            <input 
                               className="w-24 bg-transparent text-right font-handwriting text-xl p-1 focus:outline-none" 
                               placeholder="0,00"
                               value={formNetto}
                               onChange={(e) => setFormNetto(e.target.value)}
                            />
                            <span className="ml-2 text-sm">EUR</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-dotted border-slate-400 pb-1">
                         <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <span>+</span>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                              <input 
                                type="checkbox" 
                                checked={ustChecked} 
                                onChange={(e) => setUstChecked(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                              /> 
                              19% USt
                            </label>
                         </div>
                         <div className="flex items-center">
                            <input 
                               className="w-24 bg-transparent text-right font-handwriting text-xl p-1 focus:outline-none" 
                               placeholder="0,00"
                               value={formTax}
                               onChange={(e) => setFormTax(e.target.value)}
                            />
                            <span className="ml-2 text-sm">EUR</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center border-b-4 border-double border-slate-800 pt-2">
                         <span className="text-sm font-black uppercase tracking-wider">Gesamtbetrag:</span>
                         <div className="flex items-center font-bold">
                            <input 
                               className="w-24 bg-transparent text-right font-handwriting text-xl p-1 focus:outline-none font-bold" 
                               placeholder="0,00"
                               value={formTotal}
                               onChange={(e) => setFormTotal(e.target.value)}
                            />
                            <span className="ml-2 text-sm">EUR</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col justify-end space-y-6">
                      <div className="flex gap-2 items-end">
                          <input 
                            type="text" 
                            value={formPlace}
                            onChange={(e) => setFormPlace(e.target.value)}
                            placeholder="Ort"
                            className="w-32 border-b-2 border-dotted border-slate-400 bg-transparent text-center text-lg font-handwriting"
                          />
                          <span className="text-sm pb-1">, den</span>
                          <input 
                            type="date" 
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            className="flex-1 border-b-2 border-dotted border-slate-400 bg-transparent text-sm pb-1"
                          />
                      </div>
                      
                      <div 
                        onClick={() => setSigned(!signed)}
                        className="h-16 border-b-2 border-dotted border-slate-400 cursor-pointer hover:bg-black/5 flex items-end justify-center relative group"
                      >
                        {signed ? (
                          <span className="font-handwriting text-3xl text-blue-900 -rotate-6 absolute bottom-2 font-bold">H. Krause</span>
                        ) : (
                          <span className="text-slate-400 text-xs self-center group-hover:text-slate-600">Hier klicken zum Unterschreiben</span>
                        )}
                      </div>
                      <div className="text-center text-xs text-slate-500 uppercase tracking-widest">Unterschrift Empfänger</div>
                   </div>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="flex justify-center">
               <button 
                onClick={handleCashSubmit}
                className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all text-lg flex items-center gap-3"
              >
                Quittung prüfen & abgeben <ArrowRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      )}

      {step === 'finish' && (
        <div className="max-w-xl mx-auto text-center space-y-8 pt-12">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">Alles erledigt!</h2>
            <p className="text-slate-600 text-xl">
              Der Hausmeister ist zufrieden mit der korrekten Quittung.
              <br/>Du hast die Getränke besorgt und die Kaution bezahlt.
            </p>
          </div>
          
          <button 
            onClick={handleFinish}
            className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition flex items-center mx-auto text-lg shadow-xl"
          >
            Jetzt fehlt noch Deko (Online) <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
