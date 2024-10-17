import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-24 h-24 border-8 border-t-8 border-gray-500 rounded-full animate-spin"></div>
      <h1 className="mt-8 text-3xl font-semibold">Loading...</h1>
    </div>
  );
};

export default LoadingPage;
