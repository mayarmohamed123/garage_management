import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvoiceQuery } from '../../services/invoiceService';
import { useRecordPaymentMutation } from '../../services/paymentService';
import { 
  FileText, 
  CreditCard, 
  User, 
  Calendar, 
  RotateCcw, 
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import Modal from '../../components/ui/Modal';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: invoiceData, isLoading } = useGetInvoiceQuery(id);
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Cash',
    transactionId: '',
    notes: ''
  });
  const [error, setError] = useState('');

  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading invoice...</div>;
  if (!invoiceData) return <div className="p-20 text-center text-red-500">Invoice not found.</div>;

  const invoice = invoiceData.data;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await recordPayment({ invoiceId: id, ...paymentData }).unwrap();
      setIsModalOpen(false);
      setPaymentData({ amount: '', paymentMethod: 'Cash', transactionId: '', notes: '' });
    } catch (err) {
      setError(err.data?.message || 'Failed to record payment');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/invoices')} className="p-2 hover:bg-white rounded-xl transition-all border border-slate-200">
             <RotateCcw size={20} className="text-slate-500" />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Invoice #{invoice.invoiceNumber}</h2>
             <p className="text-slate-500 text-sm">Issued for Order #{invoice.serviceOrder?.orderNumber}</p>
           </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            disabled={invoice.status === 'Paid'}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            <Plus size={16} className="mr-2" /> Record Payment
          </button>
           <button 
              onClick={() => alert('PDF Generation feature coming soon!')}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
             Download PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Invoice Structure */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-start">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-1">Invoice Details</h3>
                   <div className="flex items-center text-slate-400 text-sm space-x-4">
                      <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(invoice.createdAt).toLocaleDateString()}</span>
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

          {/* Payment History */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
             <h4 className="flex items-center text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
                <CreditCard size={18} className="mr-2 text-blue-600" /> Payment History
             </h4>
             <div className="space-y-4">
                {invoice.payments?.length > 0 ? invoice.payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-3">
                           <CheckCircle size={16} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">{payment.paymentMethod} Payment</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{new Date(payment.createdAt).toLocaleDateString()} • ID: {payment.transactionId || 'N/A'}</p>
                        </div>
                     </div>
                     <span className="font-extrabold text-slate-900">${parseFloat(payment.amount).toFixed(2)}</span>
                  </div>
                )) : (
                  <div className="text-center py-6 text-slate-400 text-sm italic">No payments recorded yet.</div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Summaries */}
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
                    <span className="font-bold">-${parseFloat(invoice.paidAmount).toFixed(2)}</span>
                 </div>
                 <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Remaining</span>
                    <span className="text-4xl font-extrabold text-white tracking-tighter">${(parseFloat(invoice.totalAmount) - parseFloat(invoice.paidAmount)).toFixed(2)}</span>
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Payment">
         <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Amount to Pay ($)</label>
               <input 
                  type="number" 
                  step="0.01" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  max={parseFloat(invoice.totalAmount) - parseFloat(invoice.paidAmount)}
               />
               <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Max: ${(parseFloat(invoice.totalAmount) - parseFloat(invoice.paidAmount)).toFixed(2)}</p>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method</label>
               <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium appearance-none"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
               >
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Transaction ID (Optional)</label>
               <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
               />
            </div>
            <div className="flex gap-4 pt-4">
               <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
               >
                  Cancel
               </button>
               <button 
                  type="submit" 
                  disabled={isRecording}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
               >
                  {isRecording ? 'Recording...' : 'Record Payment'}
               </button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default InvoiceDetail;
