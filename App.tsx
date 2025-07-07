// --- Google Apps Script エンドポイント ---
const GAS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyXPIWbW625ieZAplu67n4vHZ1tKYlvOstDGK_1X8H4wdoElz7eLaHK04Zn3yaYDk9DNQ/exec';

// rev1 ここを FormData 送信に変更 --------------------------
const handleConfirmationSubmit = useCallback(() => {
  setIsSubmitting(true);
  (async () => {
    try {
      /* --- FormData を組み立てる --- */
      const fd = new FormData();

      // 画像ファイル：designA → designB の順で優先して 1 枚だけ入れる
      const fileA = (order.designA as any).uploadedFile;
      const fileB = (order.designB as any).uploadedFile;
      if (fileA instanceof File) {
        fd.append('file', fileA);            // field 名は「file」
      } else if (fileB instanceof File) {
        fd.append('file', fileB);
      }

      // 注文データ本体
      fd.append('payload', JSON.stringify(order));

      /* --- fetch 送信（ヘッダーは書かない！） --- */
      const res = await fetch(GAS_ENDPOINT, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      console.log(json);

      setView(View.COMPLETION);
    } catch (err) {
      alert('送信に失敗しました。ネットワーク接続をご確認ください。');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  })();
}, [order]);
// ----------------------------------------------------------
function App() {
  /* 既存の状態／画面切替ロジックがあればそのまま */
  return <RouterProvider router={router} />;
}

export default App;
/* --- ここまで追加 --- */