/* -----------------------------------------------------------------
 *  App.tsx  rev2  (2025-07-04)
 *    – order / selectedFile を useState で保持
 *    – ConfirmationStep に onSubmit={handleConfirmationSubmit}
 *    – handleConfirmationSubmit: FormData 送信
 * ----------------------------------------------------------------*/
import React, { useState, useCallback } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ConfirmationStep from './components/ConfirmationStep';
import DesignStep from './components/DesignStep';
import CompletionScreen from './components/CompletionScreen';

/* ------- 型定義 ---------------------------------------------- */
interface Customer {
  name: string;
  email: string;
  address: string;
}
interface Design {
  source: 'blank' | 'qr' | 'store' | 'upload';
  qrColor: string;
  storeDesignUrl?: string;
  uploadedFile?: File;
  uploadedFileUrl?: string;
}
interface Order {
  productType: 'keychain' | 'card';
  customer: Customer;
  nfcUrl: string;
  designA: Design;
  designB: Design;
}

/* ------- 初期値（null 防止用） ------------------------------- */
const initialOrder: Order = {
  productType: 'keychain',
  customer: { name: '', email: '', address: '' },
  nfcUrl: '',
  designA: { source: 'blank', qrColor: '#000000' },
  designB: { source: 'blank', qrColor: '#000000' }
};

/* ------- Google Apps Script エンドポイント ------------------- */
const GAS_ENDPOINT =
  import.meta.env.VITE_GAS_URL ??
  'https://script.google.com/macros/s/AKfycbwZ29OH9qVP-41TEVO9mFZyhHK5qRjqM0O9t8aMeWx05xtqtOctF9Az0JSI-M4SiFjzrQ/exec';

/* ------- メインコンポーネント -------------------------------- */
function App() {
  const [order, setOrder]             = useState<Order>(initialOrder);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* デザインステップで画像が選択されたとき */
  const handleFileSelect = (file: File) => setSelectedFile(file);

  /* 注文確定時に呼ばれる送信ハンドラ */
  const handleConfirmationSubmit = useCallback(async () => {
    if (!selectedFile) { alert('デザイン画像を選択してください'); return; }

    try {
      setIsSubmitting(true);

      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('payload', JSON.stringify(order));

      const res  = await fetch(GAS_ENDPOINT, { method: 'POST', body: fd });
      const json = await res.json();
      console.log(json);

      window.location.hash = '#/done';
    } catch (err) {
      console.error(err);
      alert('送信に失敗しました。ネットワークをご確認ください');
    } finally {
      setIsSubmitting(false);
    }
  }, [order, selectedFile]);

  /* ルーター定義 */
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <DesignStep
          order={order}
          setOrder={setOrder}
          onFileSelect={handleFileSelect}
        />
      ),
    },
    {
      path: '/confirm',
      element: (
        <ConfirmationStep
          order={order}
          onSubmit={handleConfirmationSubmit}
          isSubmitting={isSubmitting}
        />
      ),
    },
    { path: '/done', element: <CompletionScreen /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;