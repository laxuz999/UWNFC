
import React from 'react';
import { CheckCircleIcon } from './icons';

interface CompletionScreenProps {
  email: string;
  onReset: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ email, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-lg shadow-xl text-center">
      <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6" />
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">ご注文ありがとうございます！</h2>
      <p className="text-lg text-gray-600 mb-2">
        ご注文手続きが完了いたしました。
      </p>
      <p className="text-md text-gray-600 mb-8">
        確認メールを <span className="font-semibold text-indigo-600">{email}</span> 宛に送信しました。
        <br />
        内容をご確認の上、商品到着まで今しばらくお待ちください。
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
      >
        新しい注文を作成する
      </button>
    </div>
  );
};

export default CompletionScreen;
