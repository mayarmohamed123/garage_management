import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetInvoicesQuery, useUpdateInvoiceStatusMutation } from '../../services/invoiceService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Search, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvoicesPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateStatus] = useUpdateInvoiceStatusMutation();
  
  const { data, isLoading, error } = useGetInvoicesQuery({ search, page, limit: 10 });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Unpaid': return 'bg-red-100 text-red-800 border-red-200';
      case 'Overdue': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-slate-500 text-sm mt-1">Manage billing, payments, and financial history.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by invoice #, customer, or order #..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading invoices...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Error loading invoices.
        </div>
      ) : (
        <Table headers={['Invoice #', 'Customer', 'Total', 'Paid', 'Status', 'Date', 'Actions']}>
          {data?.data?.invoices?.length > 0 ? (
            data.data.invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-bold text-blue-600">
                  #{invoice.invoiceNumber}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900">{invoice.serviceOrder?.customer?.firstName} {invoice.serviceOrder?.customer?.lastName}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Order #{invoice.serviceOrder?.orderNumber}</div>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ${parseFloat(invoice.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell className="text-green-600 font-bold">
                  ${parseFloat(invoice.paidAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {user?.role === 'Accountant' || user?.role === 'Admin' ? (
                    <select 
                      className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none ${getStatusStyle(invoice.status)}`}
                      value={invoice.status}
                      onChange={(e) => updateStatus({ id: invoice.id, status: e.target.value })}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                      <option value="Partial">Partial</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(invoice.status)}`}>
                      {invoice.status === 'Paid' ? <CheckCircle size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                      {invoice.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                     <button 
                        onClick={() => alert('PDF Generation feature coming soon!')}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <Download size={18} />
                      </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100">
        <p>Page {page} of {data?.data?.totalPages || 1}</p>
        <div className="flex space-x-2">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-bold">
             Previous
           </button>
           <button 
             disabled={page >= (data?.data?.totalPages || 1)}
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-bold">
             Next
           </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
