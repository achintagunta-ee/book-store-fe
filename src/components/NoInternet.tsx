import React from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';

const NoInternet: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="rounded-full bg-red-50 p-6 mb-6">
        <WifiOff className="h-16 w-16 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">No Internet Connection</h2>
      <p className="mb-8 text-gray-500 max-w-md">
        Please checks your internet connection and try again.
      </p>
      <button
        onClick={handleRetry}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95 bg-blue-600"
      >
        <RefreshCcw className="h-5 w-5" />
        Retry Connection
      </button>
    </div>
  );
};

export default NoInternet;
