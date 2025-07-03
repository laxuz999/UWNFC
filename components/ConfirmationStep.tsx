import React from 'react';
import { Order, ActiveSide } from '../types';
import Preview from './Preview';

// スタイルを統一するためのセクションラッパーコンポーネント
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">{title}</h3>
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

interface ConfirmationStepProps {
    order: Order;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    onSubmit: () => void;
    onBack: () => void;
    activeSide: ActiveSide;
    setActiveSide: React.Dispatch<React.SetStateAction<ActiveSide>>;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ order, setOrder, onSubmit, onBack, activeSide, setActiveSide }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder(prev => ({...prev, customer: {...prev.customer, [name]: value}}));
    };

    const isFormValid = order.customer.name && order.customer.email && order.customer.address;

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col h-full">
            <div className="flex-grow space-y-6 pb-24">
                <p className="text-lg text-center font-semibold text-gray-800 bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    最終デザインと入力内容のご確認
                </p>

                <Preview
                    productType={order.productType}
                    designA={order.designA}
                    designB={order.designB}
                    nfcUrl={order.nfcUrl}
                    activeSide={activeSide}
                    setActiveSide={setActiveSide}
                    isInteractive={false}
                />

                 <FormSection title="お客様情報の入力">
                     <Input label="お名前" id="name" name="name" type="text" value={order.customer.name} onChange={handleInputChange} required />
                     <Input label="メールアドレス" id="email" name="email" type="email" value={order.customer.email} onChange={handleInputChange} required />
                     <Input label="ご住所" id="address" name="address" type="text" value={order.customer.address} onChange={handleInputChange} required />
                </FormSection>
            </div>
            
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 border-t border-gray-200 space-y-3">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    注文を確定する
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full px-8 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                    デザインを修正する
                </button>
                {!isFormValid && <p className="text-center text-sm text-red-600">すべてのお客様情報を入力してください。</p>}
            </div>
        </form>
    );
};

export default ConfirmationStep;
