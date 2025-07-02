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
    console.log("--- 注文が送信されました ---");

    // 1. 管理者へのメール通知 (mailto: を使用)
    console.log("管理者への通知メールを作成中...");
    const emailSubject = '【新規注文】NFCカスタムオーダー';
    const emailBody = `
新しいNFCアイテムの注文がありました。

[お客様情報]
お名前: ${order.customer.name}
メールアドレス: ${order.customer.email}
ご住所: ${order.customer.address}

[注文内容]
商品タイプ: ${order.productType === ProductType.KEYCHAIN ? 'キーホルダー' : 'カード'}
NFC書き込みURL: ${order.nfcUrl}

[デザイン詳細]
表面:
- ソース: ${order.frontDesign.source}
- QR色: ${order.frontDesign.qrColor}
- テンプレートURL: ${order.frontDesign.storeDesignUrl || 'N/A'}
- アップロードファイル: ${order.frontDesign.uploadedFileUrl ? 'あり' : 'なし'}

裏面:
- ソース: ${order.backDesign.source}
- QR色: ${order.backDesign.qrColor}
- テンプレートURL: ${order.backDesign.storeDesignUrl || 'N/A'}
- アップロードファイル: ${order.backDesign.uploadedFileUrl ? 'あり' : 'なし'}

--------------------------------
注文日時: ${new Date().toLocaleString('ja-JP')}
    `;
    const mailtoLink = `mailto:Orderas@laxuz.net?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody.trim())}`;
    window.open(mailtoLink, '_blank');
    
    // 2. お客様へのメール通知 (シミュレーション)
    console.log(`ユーザーへの確認メールを ${order.customer.email} へ送信中... (シミュレーション)`);

    // 3. Googleスプレッドシートへの記録 (シミュレーション)
    const SHEET_ID = '1OK2ANijgrpdoEMLL-mC7Yp579DSoL4ezwF8QDRhFkpA';
    // 注: 実際のアプリケーションでは、このURLはGoogle Apps Scriptで作成したセキュアなAPIエンドポイントになります。
    const SPREADSHEET_API_ENDPOINT = `https://example.com/api/sheets-append`; 
    console.log("Googleスプレッドシートへのデータ送信をシミュレートしています...");
    console.log("エンドポイント(ダミー):", SPREADSHEET_API_ENDPOINT);
    console.log("送信データ:", JSON.stringify({ sheetId: SHEET_ID, orderData: order }, null, 2));
    // fetch(SPREADSHEET_API_ENDPOINT, { ... })...

    // ネットワークリクエストをシミュレート
    setTimeout(() => {
      setIsSubmitting(false);
      setView(View.COMPLETION);
    }, 1500);
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
