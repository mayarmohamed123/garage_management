import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';

const PaymentHistory = ({ payments }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <h4 className="flex items-center text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
        <CreditCard size={18} className="mr-2 text-blue-600" /> Payment History
      </h4>
      <div className="space-y-4">
        {payments?.length > 0 ? (
          payments.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{payment.paymentMethod} Payment</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {new Date(payment.createdAt).toLocaleDateString()} • ID: {payment.transactionId || 'N/A'}
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-slate-900">${parseFloat(payment.amount).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm italic">No payments recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
