import React from 'react';
import { Order, ProductType, DesignSource, DesignConfiguration, ActiveSide } from '../types';
import { KeyIcon, CardIcon } from './icons';
import { STORE_DESIGNS } from '../constants';
import { QRCodeSVG } from 'qrcode.react';
import Preview from './Preview';

// デザインの初期状態を作成するヘルパー
const createInitialDesign = (): DesignConfiguration => ({
  source: DesignSource.BLANK,
  storeDesignUrl: '',
  uploadedFileUrl: '',
});

// スタイルを統一するためのセクションラッパーコンポーネント
const FormSection: React.FC<{ title: string; step: number; children: React.ReactNode }> = ({ title, step, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            <span className="bg-indigo-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-3">{step}</span>
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

// 汎用的な入力コンポーネント
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);


const DesignCustomizer: React.FC<{
    design: DesignConfiguration;
    setDesign: (design: DesignConfiguration) => void;
    nfcUrl: string;
}> = ({ design, setDesign, nfcUrl }) => {

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setDesign({ 
                    ...createInitialDesign(), 
                    source: DesignSource.UPLOAD, 
                    uploadedFileUrl: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSourceChange = (newSource: DesignSource) => {
        if (design.source === newSource) return;

        const newDesign = {
            ...createInitialDesign(),
            source: newSource,
        };
        
        if (newSource === DesignSource.STORE) {
            newDesign.storeDesignUrl = STORE_DESIGNS[0];
        }

        setDesign(newDesign);
    };

    const sources = [
        { id: DesignSource.BLANK, label: '白紙' },
        { id: DesignSource.QR, label: 'QRコード' },
        { id: DesignSource.STORE, label: 'テンプレート' },
        { id: DesignSource.UPLOAD, label: 'アップロード' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {sources.map(s => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSourceChange(s.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${design.source === s.id ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {design.source === DesignSource.QR && (
                <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
                    <QRCodeSVG value={nfcUrl || 'https://example.com'} size={64} />
                </div>
            )}

            {design.source === DesignSource.STORE && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                    {STORE_DESIGNS.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Store Design ${index + 1}`}
                            onClick={() => setDesign({ ...design, storeDesignUrl: url })}
                            className={`w-full aspect-square object-cover rounded-md cursor-pointer transition-transform transform hover:scale-105 ${design.storeDesignUrl === url ? 'ring-4 ring-indigo-500 ring-offset-2' : ''}`}
                        />
                    ))}
                </div>
            )}

            {design.source === DesignSource.UPLOAD && (
                 <div className="p-4 border rounded-lg bg-gray-50">
                    <label htmlFor="file-upload" className="w-full flex justify-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-sm tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                        <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                        <span className="mt-2 text-base leading-normal ml-2">ファイルを選択</span>
                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            )}
        </div>
    );
};


interface DesignStepProps {
    order: Order;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    onNext: () => void;
    activeSide: ActiveSide;
    setActiveSide: React.Dispatch<React.SetStateAction<ActiveSide>>;
}

const DesignStep: React.FC<DesignStepProps> = ({ order, setOrder, onNext, activeSide, setActiveSide }) => {

    const handleProductSelect = (productType: ProductType) => {
        setOrder(prev => ({ ...prev, productType }));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder(prev => ({...prev, [name]: value}));
    };
    
    const setDesignForActiveSide = (design: DesignConfiguration) => {
        if (activeSide === ActiveSide.FRONT) {
            setOrder(prev => ({...prev, frontDesign: design}));
        } else {
            setOrder(prev => ({...prev, backDesign: design}));
        }
    };

    const isStepValid = !!order.nfcUrl;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow space-y-6 pb-24">
                <FormSection title="商品タイプを選ぶ" step={1}>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => handleProductSelect(ProductType.KEYCHAIN)} className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${order.productType === ProductType.KEYCHAIN ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white hover:border-gray-400'}`}>
                            <KeyIcon className="w-8 h-8 text-indigo-600" />
                            <span className="font-semibold">キーホルダー</span>
                        </button>
                        <button type="button" onClick={() => handleProductSelect(ProductType.CARD)} className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${order.productType === ProductType.CARD ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white hover:border-gray-400'}`}>
                            <CardIcon className="w-8 h-8 text-indigo-600" />
                            <span className="font-semibold">カード</span>
                        </button>
                    </div>
                </FormSection>

                <FormSection title="NFCに書き込むURL" step={2}>
                    <Input label="URL" id="nfcUrl" name="nfcUrl" type="url" value={order.nfcUrl} onChange={handleInputChange} placeholder="https://example.com" required />
                </FormSection>
                
                <FormSection title="デザインを選ぶ" step={3}>
                     <div className="flex border-b border-gray-200">
                        <button type="button" onClick={() => setActiveSide(ActiveSide.FRONT)} className={`px-6 py-3 text-lg font-medium ${activeSide === ActiveSide.FRONT ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            表面のデザイン
                        </button>
                        <button type="button" onClick={() => setActiveSide(ActiveSide.BACK)} className={`px-6 py-3 text-lg font-medium ${activeSide === ActiveSide.BACK ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            裏面のデザイン
                        </button>
                    </div>
                    <div className="pt-4">
                      <DesignCustomizer
                          design={activeSide === ActiveSide.FRONT ? order.frontDesign : order.backDesign}
                          setDesign={setDesignForActiveSide}
                          nfcUrl={order.nfcUrl}
                      />
                    </div>
                </FormSection>

                 <Preview 
                    productType={order.productType}
                    frontDesign={order.frontDesign}
                    backDesign={order.backDesign}
                    nfcUrl={order.nfcUrl}
                    activeSide={activeSide}
                    setActiveSide={setActiveSide}
                    isInteractive={true}
                  />
            </div>
            
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isStepValid}
                    className="w-full px-8 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    デザインを決定
                </button>
                {!isStepValid && <p className="text-center text-sm text-red-600 mt-2">NFCに書き込むURLを入力してください。</p>}
            </div>
        </div>
    );
};

export default DesignStep;