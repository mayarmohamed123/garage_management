import React, { useState } from 'react';
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../../services/customerService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import CustomerForm from './CustomerForm';
import { Search, UserPlus, Filter, Edit, Trash2, AlertCircle, X } from 'lucide-react';

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const { data, isLoading, error: loadError } = useGetCustomersQuery({ search, page, limit: 10 });
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [error, setError] = useState('');

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this customer?')) {
        try {
            await deleteCustomer(id).unwrap();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete customer');
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your customer database and records.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <UserPlus size={18} className="mr-2" /> Add Customer
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading customers...
        </div>
      ) : loadError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Failed to load customers. Please try again later.
        </div>
      ) : (
        <Table headers={['Name', 'Contact', 'Vehicles', 'Join Date', 'Actions']}>
          {data?.data?.customers?.length > 0 ? (
            data.data.customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-slate-900">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{customer.email || 'No email'}</div>
                  <div className="text-xs text-slate-400">{customer.phoneNumber}</div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.vehicles?.length || 0} Vehicles
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                No customers found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      {/* Pagination & Modal */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Showing {data?.data?.customers?.length || 0} of {data?.data?.totalItems || 0} customers</p>
        <div className="flex space-x-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all">
            Previous
          </button>
          <button 
            disabled={page >= (data?.data?.totalPages || 1)}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all">
            Next
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm 
          customer={selectedCustomer} 
          onSuccess={handleCloseModal} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default CustomersPage;
