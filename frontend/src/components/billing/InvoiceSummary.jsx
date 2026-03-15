import React from 'react';
import { Calendar } from 'lucide-react';

const InvoiceSummary = ({ invoice }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Invoice Details</h3>
          <div className="flex items-center text-slate-400 text-sm space-x-4">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> {new Date(invoice.createdAt).toLocaleDateString()}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
              {invoice.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</p>
          <p className="text-3xl font-extrabold text-slate-900">${parseFloat(invoice.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Customer</h4>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
              {invoice.serviceOrder?.customer?.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{invoice.serviceOrder?.customer?.firstName} {invoice.serviceOrder?.customer?.lastName}</p>
              <p className="text-sm text-slate-500">{invoice.serviceOrder?.customer?.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items</h4>
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoice.serviceOrder?.parts?.map(part => (
                <tr key={part.id}>
                  <td className="py-4 font-medium text-slate-700">{part.name}</td>
                  <td className="py-4 text-right">{part.ServicePart.quantity}</td>
                  <td className="py-4 text-right">${parseFloat(part.priceAtTime).toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-slate-900">${(part.ServicePart.quantity * part.priceAtTime).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 font-medium text-slate-700">Labor Cost</td>
                <td className="py-4 text-right">1</td>
                <td className="py-4 text-right">${parseFloat(invoice.serviceOrder?.laborCost).toFixed(2)}</td>
                <td className="py-4 text-right font-bold text-slate-900">${parseFloat(invoice.serviceOrder?.laborCost).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
