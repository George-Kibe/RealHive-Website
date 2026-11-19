import React from 'react';

const LoadingPage = () => {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-screen">
      <div className="w-24 h-24 border-8 border-t-8 border-gray-500 rounded-full animate-spin"></div>
      <p className="mt-8 text-3xl font-semibold">Loading…</p>
    </div>
  );
};

export default LoadingPage;
