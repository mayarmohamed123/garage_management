import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvoiceQuery } from '../../services/invoiceService';
import { useRecordPaymentMutation } from '../../services/paymentService';
import { RotateCcw, Plus } from 'lucide-react';
import InvoiceSummary from '../../components/billing/InvoiceSummary';
import PaymentHistory from '../../components/billing/PaymentHistory';
import InvoiceSidebar from '../../components/billing/InvoiceSidebar';
import RecordPaymentModal from '../../components/billing/RecordPaymentModal';
import { LoadingState, ErrorState } from '../../components/ui/States';

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

  if (isLoading) return <LoadingState message="Loading invoice..." />;
  if (!invoiceData) return <ErrorState message="Invoice not found." />;

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
           <button onClick={() => navigate('/invoices')} className="p-2 hover:bg-white rounded-xl transition-all border border-slate-200 shadow-sm">
             <RotateCcw size={20} className="text-slate-500" />
           </button>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoice #{invoice.invoiceNumber}</h2>
             <p className="text-slate-500 text-sm font-medium">Issued for Order #{invoice.serviceOrder?.orderNumber}</p>
           </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            disabled={invoice.status === 'Paid'}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            <Plus size={16} className="mr-2" /> Record Payment
          </button>
           <button 
              onClick={() => alert('PDF Generation feature coming soon!')}
              className="flex items-center px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">
             Download PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <InvoiceSummary invoice={invoice} />
          <PaymentHistory payments={invoice.payments} />
        </div>

        <div className="space-y-8">
          <InvoiceSidebar invoice={invoice} />
        </div>
      </div>

      <RecordPaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        isRecording={isRecording}
        error={error}
        maxAmount={parseFloat(invoice.totalAmount) - parseFloat(invoice.paidAmount)}
      />
    </div>
  );
};

export default InvoiceDetail;
