import React, { useState } from 'react';
import { useGetServiceOrdersQuery } from '../../services/serviceOrderService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Search, Plus, Wrench, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, ErrorState } from '../../components/ui/States';

const ServiceOrdersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetServiceOrdersQuery({ search, page, limit: 10 });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Service Orders"
        description="Track repair jobs, status, and technician assignments."
        actionText="New Order"
        onAction={() => navigate('/service-orders/create')}
      />

      <SearchInput 
        placeholder="Search by order #, vehicle, or customer..."
        value={search}
        onChange={setSearch}
      />

      {isLoading ? (
        <LoadingState message="Loading orders..." />
      ) : error ? (
        <ErrorState message="Error loading service orders." />
      ) : (
        <Table headers={['Order #', 'Customer & Vehicle', 'Status', 'Technician', 'Date', 'Actions']}>
          {data?.data?.serviceOrders?.length > 0 ? (
            data.data.serviceOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-bold text-blue-600">
                  #{order.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900">{order.vehicle?.customer?.firstName} {order.vehicle?.customer?.lastName}</div>
                  <div className="text-xs text-slate-400">{order.vehicle?.make} {order.vehicle?.model} ({order.vehicle?.licensePlate})</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} type="service" />
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600">
                    {order.technician ? `${order.technician.firstName} ${order.technician.lastName}` : 'Unassigned'}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => navigate(`/service-orders/${order.id}`)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState message="No service orders found matching your search." />
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
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium">
             Previous
           </button>
           <button 
             disabled={page >= (data?.data?.totalPages || 1)}
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium">
             Next
           </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrdersPage;
