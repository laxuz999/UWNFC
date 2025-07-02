
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          NFCアイテム カスタムオーダー
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          あなただけのオリジナルNFCキーホルダーやカードを作成しましょう。
        </p>
      </div>
    </header>
  );
};

export default Header;
