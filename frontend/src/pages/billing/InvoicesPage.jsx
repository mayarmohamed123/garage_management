import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetInvoicesQuery, useUpdateInvoiceStatusMutation } from '../../services/invoiceService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Search, CheckCircle, Clock, Eye, Download, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';

const InvoicesPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateStatus] = useUpdateInvoiceStatusMutation();
  
  const { data, isLoading, error } = useGetInvoicesQuery({ search, page, limit: 10 });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Invoices"
        description="Manage billing, payments, and financial history."
      />

      <SearchInput 
        placeholder="Search by invoice #, customer, or order #..."
        value={search}
        onChange={setSearch}
      />

      {isLoading ? (
        <LoadingState message="Loading invoices..." />
      ) : error ? (
        <ErrorState message="Error loading invoices." />
      ) : (
        <Table headers={['Invoice #', 'Customer', 'Total', 'Paid', 'Status', 'Date', 'Actions']}>
          {data?.data?.invoices?.length > 0 ? 
            data.data.invoices.map((invoice) => {
              const totalPaid = invoice.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-bold text-blue-600">
                    #{invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{invoice.serviceOrder?.vehicle?.customer?.firstName} {invoice.serviceOrder?.vehicle?.customer?.lastName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Order #{invoice.serviceOrder?.orderNumber}</div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    ${parseFloat(invoice.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-green-600 font-bold">
                    ${totalPaid.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'Accountant' || user?.role === 'Admin' ? (
                      <select 
                        className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none bg-white border-slate-200 transition-all focus:ring-2 focus:ring-blue-500`}
                        value={invoice.status}
                        onChange={(e) => updateStatus({ id: invoice.id, status: e.target.value })}
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    ) : (
                      <StatusBadge status={invoice.status} type="invoice" />
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
              );
            }) : (
            <TableRow>
              <TableCell colSpan={7}>
                <EmptyState message="No invoices found matching your criteria." icon={Receipt} />
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
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
