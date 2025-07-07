import React from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { ActiveSide } from '../types';

interface PreviewProps {
  productType: string;
  designA: any;
  designB: any;
  nfcUrl: string;
  activeSide: ActiveSide;
  setActiveSide: React.Dispatch<React.SetStateAction<ActiveSide>>;
  isInteractive?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ productType, designA, designB, nfcUrl, activeSide, setActiveSide, isInteractive = false }) => {
  
  // デザインが未設定の場合でも落ちないようデフォルトを用意
  const blankDesign = { source: 'blank', qrColor: '#000000' };
  const currentDesign: any =
    (activeSide === ActiveSide.A ? designA : designB) || blankDesign;

  const handleToggleSide = () => {
    setActiveSide(prev => (prev === ActiveSide.A ? ActiveSide.B : ActiveSide.A));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 24,
      }}
    >
      {/* トグルボタン */}
      <button
        onClick={handleToggleSide}
        disabled={!isInteractive}
        style={{
          marginBottom: 16,
          padding: '6px 14px',
          borderRadius: 4,
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          cursor: isInteractive ? 'pointer' : 'default',
          opacity: isInteractive ? 1 : 0.5,
        }}
      >
        {activeSide === ActiveSide.A ? 'B面を表示' : 'A面を表示'}
      </button>

      {/* プレビューカード */}
      <div
        style={{
          width: 260,
          height: 260,
          border: '1px solid #d1d5db',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#fff',
        }}
      >
        {/* 中身 */}
        {currentDesign?.source === 'blank' && (
          <span style={{ color: '#6b7280', fontSize: 18 }}>白紙</span>
        )}

        {currentDesign?.source === 'qr' && (
          <QRCode
            value={nfcUrl || ''}
            size={200}
            fgColor={currentDesign.qrColor || '#000'}
          />
        )}

        {(currentDesign?.source === 'store' ||
          currentDesign?.source === 'upload') && (
          <img
            src={
              currentDesign.uploadedFileUrl || currentDesign.storeDesignUrl || ''
            }
            alt="Design preview"
            style={{ width: 240, height: 240, objectFit: 'contain' }}
          />
        )}

        {/* ラベル */}
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            right: 10,
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          {activeSide === ActiveSide.A ? 'A面' : 'B面'}
        </div>
      </div>
    </div>
  );
};

export default Preview;