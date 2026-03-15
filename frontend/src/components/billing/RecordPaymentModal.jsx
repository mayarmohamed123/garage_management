import React from 'react';
import Modal from '../ui/Modal';

const RecordPaymentModal = ({ isOpen, onClose, onSubmit, paymentData, setPaymentData, isRecording, error, maxAmount }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record New Payment">
      <form onSubmit={onSubmit} className="space-y-4">
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
            max={maxAmount}
          />
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Max: ${parseFloat(maxAmount).toFixed(2)}</p>
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
            onClick={onClose}
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
  );
};

export default RecordPaymentModal;
