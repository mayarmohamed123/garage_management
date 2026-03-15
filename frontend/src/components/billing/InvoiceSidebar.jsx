import React from 'react';

const InvoiceSidebar = ({ invoice }) => {
  const totalPaid = invoice.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
  const remainingValue = parseFloat(invoice.totalAmount) - totalPaid;

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/10">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Payment Summary</h4>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Total Amount</span>
            <span className="font-bold">${parseFloat(invoice.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-green-400">
            <span className="text-sm">Total Paid</span>
            <span className="font-bold">-${totalPaid.toFixed(2)}</span>
          </div>
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Remaining</span>
            <span className="text-4xl font-extrabold text-white tracking-tighter">${remainingValue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Internal Notes</h4>
        <p className="text-xs text-blue-800/70 leading-relaxed font-medium">
          {invoice.serviceOrder?.description || 'No additional notes provided for this order.'}
        </p>
      </div>
    </div>
  );
};

export default InvoiceSidebar;
