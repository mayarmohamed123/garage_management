import React from 'react';
import { AlertCircle } from 'lucide-react';

export const LoadingState = ({ message = "Loading content..." }) => (
  <div className="flex flex-col justify-center items-center py-20 text-slate-400">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
    <p className="font-bold text-sm tracking-widest uppercase">{message}</p>
  </div>
);

export const ErrorState = ({ message = "Something went wrong while loading data." }) => (
  <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center flex flex-col items-center">
    <AlertCircle size={40} className="mb-4 opacity-50" />
    <p className="font-bold">{message}</p>
    <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl transition-all font-bold text-xs"
    >
        Try Again
    </button>
  </div>
);

export const EmptyState = ({ message = "No records found.", icon }) => {
  const Icon = icon || AlertCircle;
  return (
    <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
      <Icon size={48} className="mx-auto text-slate-200 mb-4" />
      <p className="text-slate-400 font-bold tracking-tight">{message}</p>
    </div>
  );
};
