import React, { useState, useCallback } from 'react';
import { Order, ProductType, DesignSource, DesignConfiguration, View, ActiveSide } from './types';
import Header from './components/Header';
import DesignStep from './components/DesignStep';
import ConfirmationStep from './components/ConfirmationStep';
import CompletionScreen from './components/CompletionScreen';

// デザインの初期状態を作成するヘルパー
const createInitialDesign = (): DesignConfiguration => ({
  source: DesignSource.BLANK,
  qrColor: '#000000',
  storeDesignUrl: '',
  uploadedFileUrl: '',
});

// 注文の初期状態を作成するヘルパー
const createInitialOrder = (): Order => ({
  productType: ProductType.KEYCHAIN,
  customer: {
    name: '',
    email: '',
    address: '',
  },
  nfcUrl: '',
  frontDesign: createInitialDesign(),
  backDesign: createInitialDesign(),
});

// --- Google Apps Script エンドポイント ---
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyXPIWbW625ieZAplu67n4vHZ1tKYlvOstDGK_1X8H4wdoElz7eLaHK04Zn3yaYDk9DNQ/exec';

const App: React.FC = () => {
  const [order, setOrder] = useState<Order>(createInitialOrder());
  const [view, setView] = useState<View>(View.DESIGN);
  const [activeSide, setActiveSide] = useState<ActiveSide>(ActiveSide.FRONT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDesignSubmit = useCallback(() => {
    setView(View.CONFIRMATION);
  }, []);

  const handleBackToDesign = useCallback(() => {
    setView(View.DESIGN);
  }, []);

  const handleConfirmationSubmit = useCallback(() => {
    setIsSubmitting(true);
    (async () => {
      try {
        await fetch(GAS_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(order),
        });
        setView(View.COMPLETION);
      } catch (err) {
        alert('送信に失敗しました。ネットワーク接続をご確認ください。');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [order]);

  const handleReset = useCallback(() => {
    setOrder(createInitialOrder());
    setActiveSide(ActiveSide.FRONT);
    setView(View.DESIGN);
  }, []);

  const renderCurrentStep = () => {
    switch (view) {
      case View.DESIGN:
        return <DesignStep order={order} setOrder={setOrder} onNext={handleDesignSubmit} activeSide={activeSide} setActiveSide={setActiveSide} />;
      case View.CONFIRMATION:
        return <ConfirmationStep order={order} setOrder={setOrder} onSubmit={handleConfirmationSubmit} onBack={handleBackToDesign} activeSide={activeSide} setActiveSide={setActiveSide} />;
      case View.COMPLETION:
        return <CompletionScreen email={order.customer.email} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center p-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-700">ご注文を処理中です...</p>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </main>
    </div>
  );
};

export default App;
