import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ProductType, DesignConfiguration, DesignSource, ActiveSide } from '../types';

interface PreviewProps {
  productType: ProductType;
  frontDesign: DesignConfiguration;
  backDesign: DesignConfiguration;
  nfcUrl: string;
  activeSide: ActiveSide;
  setActiveSide: React.Dispatch<React.SetStateAction<ActiveSide>>;
  isInteractive?: boolean;
}

const DesignContent: React.FC<{ design: DesignConfiguration; nfcUrl: string; isKeychain: boolean; isFullscreen?: boolean }> = ({ design, nfcUrl, isKeychain, isFullscreen = false }) => {
  switch (design.source) {
    case DesignSource.BLANK:
      return <div className="w-full h-full flex items-center justify-center text-gray-400">白紙</div>;
    case DesignSource.QR:
      const qrSize = isFullscreen 
        ? (isKeychain ? 240 : 320) 
        : (isKeychain ? 80 : 128);
      return (
        <div className="w-full h-full bg-white p-2 flex items-center justify-center">
          <QRCodeSVG value={nfcUrl || 'https://example.com'} size={qrSize} fgColor={design.qrColor} />
        </div>
      );
    case DesignSource.STORE:
      return <img src={design.storeDesignUrl} alt="Store Design" className="w-full h-full object-cover" />;
    case DesignSource.UPLOAD:
      return <img src={design.uploadedFileUrl} alt="User Upload" className="w-full h-full object-cover" />;
    default:
      return null;
  }
};

const SingleSidePreview: React.FC<{
    side: ActiveSide;
    label: string;
    design: DesignConfiguration;
    isActive: boolean;
    onClick: () => void;
    productType: ProductType;
    nfcUrl: string;
    isInteractive: boolean;
}> = ({ side, label, design, isActive, onClick, productType, nfcUrl, isInteractive }) => {
    const isKeychain = productType === ProductType.KEYCHAIN;

    const baseClasses = "relative bg-white bg-opacity-80 backdrop-blur-sm shadow-lg overflow-hidden transition-all duration-300 flex items-center justify-center text-gray-300";
    const interactiveClasses = isInteractive ? "cursor-pointer" : "cursor-default";
    const keychainClasses = `w-40 h-40 rounded-3xl border-2 border-dashed`; // 正方形に変更
    const cardClasses = `w-72 h-44 rounded-xl border-2 border-dashed`;
    const activeRingClasses = isActive && isInteractive ? 'border-indigo-500 ring-4 ring-indigo-500 ring-offset-2' : 'border-gray-300';

    return (
        <div 
            onClick={onClick}
            className={`${baseClasses} ${interactiveClasses} ${isKeychain ? keychainClasses : cardClasses} ${activeRingClasses}`}
        >
            <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
            <div className="absolute inset-0">
                <DesignContent design={design} nfcUrl={nfcUrl} isKeychain={isKeychain} />
            </div>
            <span className="absolute bottom-2 text-xs font-mono bg-black bg-opacity-50 text-white px-2 py-0.5 rounded">
                {label}
            </span>
        </div>
    );
};


const Preview: React.FC<PreviewProps> = ({ productType, frontDesign, backDesign, nfcUrl, activeSide, setActiveSide, isInteractive = true }) => {
  const [fullscreenSide, setFullscreenSide] = useState<ActiveSide | null>(null);

  const handlePreviewClick = (side: ActiveSide) => {
    if (isInteractive) {
        setActiveSide(side);
    }
    setFullscreenSide(side);
  };
  
  const designToShow = fullscreenSide === ActiveSide.FRONT ? frontDesign : (fullscreenSide === ActiveSide.BACK ? backDesign : null);
  const isKeychain = productType === ProductType.KEYCHAIN;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">プレビュー</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <SingleSidePreview 
          side={ActiveSide.FRONT}
          label="表面"
          design={frontDesign}
          isActive={activeSide === ActiveSide.FRONT}
          onClick={() => handlePreviewClick(ActiveSide.FRONT)}
          productType={productType}
          nfcUrl={nfcUrl}
          isInteractive={isInteractive}
        />
        
        <SingleSidePreview 
          side={ActiveSide.BACK}
          label="裏面"
          design={backDesign}
          isActive={activeSide === ActiveSide.BACK}
          onClick={() => handlePreviewClick(ActiveSide.BACK)}
          productType={productType}
          nfcUrl={nfcUrl}
          isInteractive={isInteractive}
        />
      </div>

      <p className="text-sm text-gray-500 pt-6 text-center">
        {isInteractive ? "編集したい面を選択してください。" : "最終デザインをご確認ください。"}<br/>プレビューをクリックすると全画面で表示します。
      </p>

      {fullscreenSide && designToShow && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 cursor-pointer animate-fade-in"
          onClick={() => setFullscreenSide(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative cursor-default"
          >
            {(() => {
              const baseClasses = "relative bg-white bg-opacity-90 backdrop-blur-md shadow-2xl overflow-hidden flex items-center justify-center";
              const keychainClasses = `w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] max-w-[500px] max-h-[500px] rounded-3xl border-4 border-dashed border-gray-300`; // 正方形に変更
              const cardClasses = `w-[85vw] h-[53vw] md:w-[70vw] md:h-[43vw] max-w-[854px] max-h-[530px] rounded-xl border-4 border-dashed border-gray-300`;

              return (
                <div className={`${baseClasses} ${isKeychain ? keychainClasses : cardClasses}`}>
                    <div className="absolute inset-0">
                        <DesignContent design={designToShow} nfcUrl={nfcUrl} isKeychain={isKeychain} isFullscreen={true} />
                    </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};


export default Preview;