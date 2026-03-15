import React from 'react';
import { Plus } from 'lucide-react';

const PageHeader = ({ title, description, actionText, onAction, actionIcon }) => {
  const Icon = actionIcon || Plus;
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
        >
          {Icon && <Icon size={18} className="mr-2" />} {actionText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
