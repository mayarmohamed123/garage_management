import React, { useState } from 'react';
import { useGetServiceOrdersQuery } from '../../services/serviceOrderService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Search, Plus, Wrench, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceOrdersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetServiceOrdersQuery({ search, page, limit: 10 });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={12} className="mr-1" />;
      case 'In Progress': return <Wrench size={12} className="mr-1" />;
      case 'Completed': return <CheckCircle size={12} className="mr-1" />;
      case 'Cancelled': return <AlertCircle size={12} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Service Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Track repair jobs, status, and technician assignments.</p>
        </div>
        <button 
          onClick={() => navigate('/service-orders/create')}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} className="mr-2" /> New Order
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by order #, vehicle, or customer..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading orders...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Error loading service orders.
        </div>
      ) : (
        <Table headers={['Order #', 'Customer & Vehicle', 'Status', 'Technician', 'Date', 'Actions']}>
          {data?.data?.serviceOrders?.length > 0 ? (
            data.data.serviceOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-bold text-blue-600">
                  #{order.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900">{order.customer?.firstName} {order.customer?.lastName}</div>
                  <div className="text-xs text-slate-400">{order.vehicle?.make} {order.vehicle?.model} ({order.vehicle?.licensePlate})</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
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
              <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                No service orders found.
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
