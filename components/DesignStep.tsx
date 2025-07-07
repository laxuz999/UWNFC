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
  
  const currentDesign = activeSide === ActiveSide.A ? designA : designB;

  const handleToggleSide = () => {
    setActiveSide(prev => (prev === ActiveSide.A ? ActiveSide.B : ActiveSide.A));
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <button onClick={handleToggleSide} disabled={!isInteractive}>
          {activeSide === ActiveSide.A ? 'A面を表示' : 'B面を表示'}
        </button>
      </div>
      <div className="preview-content">
        {/* -------- プレビュー描画 -------- */}
        {currentDesign.source === 'blank' && (
          <div style={{ width: 220, height: 220, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#888' }}>白紙</span>
          </div>
        )}

        {currentDesign.source === 'qr' && (
          <QRCode value={nfcUrl || ''} size={220} fgColor={currentDesign.qrColor || '#000'} />
        )}

        {(currentDesign.source === 'store' || currentDesign.source === 'upload') && (
          <img
            src={currentDesign.uploadedFileUrl || currentDesign.storeDesignUrl || ''}
            alt="Design preview"
            style={{ width: 220, height: 220, objectFit: 'contain', border: '1px solid #eee' }}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;