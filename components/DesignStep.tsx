import React from 'react';
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
        {/* Render the preview based on currentDesign */}
        {/* This is a placeholder, actual rendering logic should be here */}
        <p>Product Type: {productType}</p>
        <p>Active Side: {activeSide === ActiveSide.A ? 'A' : 'B'}</p>
        <p>NFC URL: {nfcUrl}</p>
        <div>
          {/* Assuming design has some image or content */}
          {currentDesign && currentDesign.source && (
            <p>Design Source: {currentDesign.source}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;