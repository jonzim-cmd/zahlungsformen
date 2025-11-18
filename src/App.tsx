import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layout/Layout';

import { IntroPage } from './features/intro/IntroPage';

import { GirokontoPage } from './features/girokonto/GirokontoPage';

import { PaymentMethodsPage } from './features/online_shopping/PaymentMethodsPage';
import { OfflineShoppingPage } from './features/offline_shopping/OfflineShoppingPage';
import { OnlineShoppingPage } from './features/online_shopping/OnlineShoppingPage';
import { TransferPage } from './features/transfer/TransferPage';
import { ReflectionPage } from './features/reflection/ReflectionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IntroPage />} />
          <Route path="girokonto" element={<GirokontoPage />} />
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
          <Route path="offline" element={<OfflineShoppingPage />} />
          <Route path="online" element={<OnlineShoppingPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="reflection" element={<ReflectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

