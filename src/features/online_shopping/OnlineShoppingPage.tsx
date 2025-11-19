import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Globe, Banknote, Truck, ArrowRight, Building2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const OnlineShoppingPage: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'cart' | 'address' | 'payment' | 'processing' | 'success'>('intro');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'klarna' | 'invoice' | 'sepa' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { updateBalance, addToInventory, completeModule, userIban, userBic, bankName, userFirstName, userLastName } = useGameStore();
  const navigate = useNavigate();
  
  const fullName = `${userFirstName} ${userLastName}`;

  // Form States - Address starts empty
  const [address, setAddress] = useState({ name: '', street: '', city: '' });
  const [sepaData, setSepaData] = useState({ iban: '', bic: '', holder: '' });

  const cartTotal = 29.95 + 15.95;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.name && address.street && address.city) {
      setStep('payment');
    }
  };

  const handleMethodSelect = (method: 'paypal' | 'card' | 'klarna' | 'invoice' | 'sepa') => {
    setPaymentMethod(method);
    setErrorMsg(null);
  };

  const handleFakeLogin = () => {
    setErrorMsg("Login fehlgeschlagen! Du bist erst 15 und darfst noch keinen PayPal-Account haben.");
  };

  const handleFakeCard = () => {
     setErrorMsg("Zahlung abgelehnt! Du besitzt keine Kreditkarte. Deine Girocard funktioniert hier oft nicht.");
  };

  const handleKlarnaCheck = () => {
     setErrorMsg("Identitätsprüfung fehlgeschlagen. Klarna-Dienste sind erst ab 18 Jahren verfügbar.");
  };

  const handleInvoiceCheck = () => {
    setErrorMsg("Kauf auf Rechnung abgelehnt. Leider bieten wir diese Option für Neukunden beim Erstkauf nicht an.");
  };

  const handleSepaPayment = () => {
    // Validate Input against store data
    const cleanInput = sepaData.iban.replace(/\s/g, '');
    const cleanUser = userIban.replace(/\s/g, '');

    if (cleanInput !== cleanUser) {
      setErrorMsg("Die IBAN stimmt nicht mit deinem Konto überein. Schau auf deine Bankdaten!");
      return;
    }
    
    // Loose name check
    if (!sepaData.holder.toLowerCase().includes(userLastName.toLowerCase())) {
       setErrorMsg("Kontoinhaber muss dein Name sein!");
       return;
    }

    setStep('processing');
    setTimeout(() => {
      setStep('success');
      completeModule('online');
      updateBalance(-cartTotal);
      addToInventory('Party-Deko');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-8">
      
      {step === 'intro' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
           <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
             <ShoppingCart className="w-10 h-10 text-purple-600" />
           </div>
           <h2 className="text-2xl font-bold">Deko fehlt noch!</h2>
           <p className="text-slate-600 text-lg">
             Du warst in allen Geschäften in der Stadt, aber nirgends gab es die passende Deko für deine Party.
             <br/>Es bleibt nur eine Möglichkeit: <strong>Online bestellen.</strong>
           </p>
           <p className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500">
             Du hast einen coolen Party-Shop gefunden. Die Lieferung dauert nur 2 Tage. Perfekt!
           </p>
           <button 
             onClick={() => setStep('cart')}
             className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
           >
             Zum Online-Shop
           </button>
        </div>
      )}

      {step !== 'intro' && (
        <div className="flex justify-center mb-8 text-sm font-medium text-slate-500">
          <div className={clsx("flex items-center", step === 'cart' && "text-brand-600")}>1. Warenkorb</div>
          <div className="mx-4 text-slate-300">&gt;</div>
          <div className={clsx("flex items-center", step === 'address' && "text-brand-600")}>2. Daten</div>
          <div className="mx-4 text-slate-300">&gt;</div>
          <div className={clsx("flex items-center", step === 'payment' && "text-brand-600")}>3. Bezahlung</div>
        </div>
      )}

      {step === 'cart' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4">Dein Warenkorb</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">🎈</div>
                  <div className="flex-1">
                    <h3 className="font-bold">XXL Party Deko Set</h3>
                    <p className="text-sm text-slate-500">Gold & Schwarz, 50 Teile</p>
                  </div>
                  <div className="font-bold">29,95 €</div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">🔦</div>
                  <div className="flex-1">
                    <h3 className="font-bold">LED Lichterkette</h3>
                    <p className="text-sm text-slate-500">10 Meter, Warmweiß</p>
                  </div>
                  <div className="font-bold">15,95 €</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold mb-4 text-lg">Zusammenfassung</h3>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600">Zwischensumme</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-slate-600">Versand</span>
                <span className="text-green-600">Kostenlos</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-xl">
                <span>Gesamt</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <button 
                onClick={() => setStep('address')}
                className="w-full mt-6 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700"
              >
                Zur Kasse
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'address' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6">Lieferadresse</h2>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vor- und Nachname</label>
              <input 
                required
                type="text" 
                value={address.name}
                onChange={e => setAddress({...address, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Max Mustermann"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Straße & Hausnummer</label>
              <input 
                required
                type="text" 
                value={address.street}
                onChange={e => setAddress({...address, street: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Musterstraße 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PLZ & Ort</label>
              <input 
                required
                type="text" 
                value={address.city}
                onChange={e => setAddress({...address, city: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="12345 Musterstadt"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 mt-4">
              Weiter zur Zahlung
            </button>
          </form>
        </div>
      )}

      {step === 'payment' && (
        <div className="grid md:grid-cols-2 gap-8 items-start">
           {/* Bank Data Helper Card */}
           <div className="bg-slate-800 text-slate-200 p-6 rounded-xl shadow-lg h-fit sticky top-4">
              <div className="flex justify-between items-start mb-8">
                 <Building2 className="w-8 h-8 opacity-50" />
                 <span className="font-bold tracking-widest">{bankName}</span>
              </div>
              <div className="space-y-4 mb-8">
                 <div>
                   <div className="text-xs uppercase opacity-50 mb-1">Deine IBAN</div>
                   <div className="font-mono text-lg tracking-wider break-all">{userIban}</div>
                 </div>
                 <div>
                   <div className="text-xs uppercase opacity-50 mb-1">Deine BIC</div>
                   <div className="font-mono tracking-wider">{userBic}</div>
                 </div>
              </div>
              <div className="text-sm uppercase tracking-widest">{fullName}</div>
           </div>

          <div>
            <h2 className="text-xl font-bold mb-6">Zahlungsart wählen</h2>
            
            <div className="space-y-3 mb-6">
              {/* PayPal */}
              <div 
                onClick={() => handleMethodSelect('paypal')}
                className={clsx(
                  "p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all",
                  paymentMethod === 'paypal' ? "border-blue-500 bg-blue-50" : "bg-white border-slate-200 hover:border-blue-200"
                )}
              >
                <Globe className="w-6 h-6 text-blue-600" />
                <span className="font-bold">PayPal</span>
              </div>

              {/* Credit Card */}
              <div 
                onClick={() => handleMethodSelect('card')}
                className={clsx(
                  "p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all",
                  paymentMethod === 'card' ? "border-purple-500 bg-purple-50" : "bg-white border-slate-200 hover:border-purple-200"
                )}
              >
                <CreditCard className="w-6 h-6 text-purple-600" />
                <span className="font-bold">Kreditkarte</span>
              </div>

              {/* Klarna */}
              <div 
                onClick={() => handleMethodSelect('klarna')}
                className={clsx(
                  "p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all",
                  paymentMethod === 'klarna' ? "border-pink-500 bg-pink-50" : "bg-white border-slate-200 hover:border-pink-200"
                )}
              >
                <Banknote className="w-6 h-6 text-pink-600" />
                <div className="flex flex-col">
                    <span className="font-bold">Klarna</span>
                    <span className="text-xs text-slate-500">Sofort oder später bezahlen</span>
                </div>
              </div>

               {/* Invoice */}
               <div 
                onClick={() => handleMethodSelect('invoice')}
                className={clsx(
                  "p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all",
                  paymentMethod === 'invoice' ? "border-slate-500 bg-slate-50" : "bg-white border-slate-200 hover:border-slate-400"
                )}
              >
                <Banknote className="w-6 h-6 text-slate-600" />
                <span className="font-bold">Kauf auf Rechnung</span>
              </div>

               {/* SEPA Lastschrift */}
               <div 
                onClick={() => handleMethodSelect('sepa')}
                className={clsx(
                  "p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all",
                  paymentMethod === 'sepa' ? "border-brand-500 bg-brand-50" : "bg-white border-slate-200 hover:border-brand-200"
                )}
              >
                <Building2 className="w-6 h-6 text-brand-600" />
                <span className="font-bold">Lastschrift (Bankeinzug)</span>
              </div>
            </div>

            {/* Dynamic Form */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[200px]">
              {errorMsg && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 flex items-start gap-2 animate-pulse">
                   <AlertCircle className="w-5 h-5 flex-shrink-0" />
                   {errorMsg}
                </div>
              )}

              {!paymentMethod && <p className="text-center text-slate-500 py-8">Bitte wähle eine Zahlungsart aus.</p>}
              
              {paymentMethod === 'paypal' && (
                 <div className="space-y-4">
                    <p className="text-sm">Melde dich bei PayPal an:</p>
                    <input className="w-full p-2 border rounded" placeholder="Email" />
                    <input className="w-full p-2 border rounded" type="password" placeholder="Passwort" />
                    <button onClick={handleFakeLogin} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Einloggen</button>
                 </div>
              )}

              {paymentMethod === 'card' && (
                 <div className="space-y-4">
                    <p className="text-sm">Kartendaten:</p>
                    <input className="w-full p-2 border rounded" placeholder="Kartennummer" />
                    <div className="flex gap-2">
                      <input className="w-1/2 p-2 border rounded" placeholder="MM/YY" />
                      <input className="w-1/2 p-2 border rounded" placeholder="CVC" />
                    </div>
                    <button onClick={handleFakeCard} className="w-full bg-purple-600 text-white py-2 rounded font-bold">Zahlen</button>
                 </div>
              )}

              {paymentMethod === 'klarna' && (
                 <div className="space-y-4 text-center">
                    <p className="text-sm">Zahlung über Klarna abwickeln.</p>
                    <button onClick={handleKlarnaCheck} className="w-full bg-pink-500 text-white py-2 rounded font-bold">Identität prüfen & Zahlen</button>
                 </div>
              )}

              {paymentMethod === 'invoice' && (
                 <div className="space-y-4 text-center">
                    <p className="text-sm">Die Ware wird versendet, du zahlst später.</p>
                    <button onClick={handleInvoiceCheck} className="w-full bg-slate-700 text-white py-2 rounded font-bold">Bestellung abschließen</button>
                 </div>
              )}

              {paymentMethod === 'sepa' && (
                 <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Beim Bankeinzug erlaubst du dem Shop, das Geld von deinem Konto abzubuchen. Gib deine Daten ein.
                    </p>
                    <div>
                       <label className="text-xs font-bold uppercase text-slate-500">Kontoinhaber</label>
                       <input 
                         className="w-full p-2 border rounded" 
                         value={sepaData.holder}
                         onChange={e => setSepaData({...sepaData, holder: e.target.value})}
                         placeholder="Vorname Nachname"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold uppercase text-slate-500">IBAN</label>
                       <input 
                         className="w-full p-2 border rounded font-mono" 
                         value={sepaData.iban}
                         onChange={e => setSepaData({...sepaData, iban: e.target.value})}
                         placeholder="DE..."
                       />
                    </div>
                    <button onClick={handleSepaPayment} className="w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700">
                      Kostenpflichtig bestellen
                    </button>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'processing' && (
         <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold">Zahlung wird verarbeitet...</h2>
         </div>
      )}

      {step === 'success' && (
        <div className="max-w-xl mx-auto text-center py-12">
           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <Truck className="w-10 h-10 text-emerald-600" />
           </div>
           <h2 className="text-3xl font-bold mb-4">Bestellung erfolgreich!</h2>
           <p className="text-slate-600 mb-8 text-lg">
             Deine Party-Deko ist auf dem Weg. <br/>
             Der Betrag ({cartTotal.toFixed(2)} €) wird per Lastschrift abgebucht.
           </p>
           <button 
             onClick={() => navigate('/transfer')}
             className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition flex items-center mx-auto"
           >
             Weiter zu den Überweisungen <ArrowRight className="ml-2" />
           </button>
        </div>
      )}
    </div>
  );
};
