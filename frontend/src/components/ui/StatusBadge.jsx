import React from 'react';
import { Clock, Wrench, CheckCircle, AlertCircle, Power } from 'lucide-react';

const StatusBadge = ({ status, type = 'service' }) => {
  const getStyle = () => {
    if (type === 'service') {
      switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-slate-100 text-slate-800 border-slate-200';
      }
    } else if (type === 'auth') {
      return status === 'active' 
        ? 'bg-green-100 text-green-700 border-green-200' 
        : 'bg-red-100 text-red-700 border-red-200';
    } else if (type === 'invoice') {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'Unpaid': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getIcon = () => {
    if (type === 'service') {
      switch (status) {
        case 'Pending': return <Clock size={12} className="mr-1" />;
        case 'In Progress': return <Wrench size={12} className="mr-1" />;
        case 'Completed': return <CheckCircle size={12} className="mr-1" />;
        case 'Cancelled': return <AlertCircle size={12} className="mr-1" />;
        default: return null;
      }
    }
    return null;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border ${getStyle()}`}>
      {getIcon()}
      {status}
    </span>
  );
};

export default StatusBadge;
