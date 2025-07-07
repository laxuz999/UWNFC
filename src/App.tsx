/* -----------------------------------------------------------------
 *  App.tsx  rev23  (2025‑07‑07)
 *    – 3 ステップ UI (Design → Confirm → Done)
 *    – Google Apps Script へ FormData 送信
 * ----------------------------------------------------------------*/
import React, { useState, useCallback } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DesignStep from './components/DesignStep';
import ConfirmationStep from './components/ConfirmationStep';
import CompletionScreen from './components/CompletionScreen';

/* ---------- 型定義 ---------- */
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

/* ---------- 初期値 ---------- */
const initialOrder: Order = {
  productType: 'keychain',
  customer: { name: '', email: '', address: '' },
  nfcUrl: '',
  designA: { source: 'blank', qrColor: '#000000' },
  designB: { source: 'blank', qrColor: '#000000' }
};

/* ---------- GAS エンドポイント ---------- */
const GAS_ENDPOINT =
  import.meta.env.VITE_GAS_URL ??
  'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXX/exec';

/* ---------- App 本体 ---------- */
export default function App() {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* 画像が選択されたとき */
  const handleFileSelect = (file: File) => setSelectedFile(file);

  /* 注文確定時 */
  const handleConfirmationSubmit = useCallback(async () => {
    if (!selectedFile) { alert('デザイン画像を選択してください'); return; }

    try {
      setIsSubmitting(true);

      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('payload', JSON.stringify(order));

      const res  = await fetch(GAS_ENDPOINT, { method: 'POST', body: fd });
      const json = await res.json();
      console.log('[dbg]', json);

      window.location.hash = '#/done';
    } catch (err) {
      console.error(err);
      alert('送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [order, selectedFile]);

  /* ルーティング */
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <DesignStep
          order={order}
          setOrder={setOrder}
          onFileSelect={handleFileSelect}
        />
      )
    },
    {
      path: '/confirm',
      element: (
        <ConfirmationStep
          order={order}
          onSubmit={handleConfirmationSubmit}
          isSubmitting={isSubmitting}
        />
      )
    },
    { path: '/done', element: <CompletionScreen /> }
  ]);

  return <RouterProvider router={router} />;
}