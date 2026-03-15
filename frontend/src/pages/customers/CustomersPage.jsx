import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../../services/customerService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import CustomerForm from './CustomerForm';
import { Search, UserPlus, Filter, Edit, Trash2, AlertCircle, X, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';

const CustomersPage = () => {
  const { t } = useTranslation();
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
    if (window.confirm(t('customers.deleteConfirm'))) {
        try {
            await deleteCustomer(id).unwrap();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete customer');
        }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('customers.title')}
        description={t('customers.description')}
        actionText={t('customers.addCustomer')}
        actionIcon={UserPlus}
        onAction={() => handleOpenModal()}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput 
            placeholder={t('customers.placeholder')}
            value={search}
            onChange={setSearch}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-medium">
          <Filter size={18} className="mx-2" /> {t('common.filters') || 'Filters'}
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
        <LoadingState message={t('customers.loading')} />
      ) : loadError ? (
        <ErrorState message={t('customers.error')} />
      ) : (
        <Table headers={[t('customers.name'), t('customers.contact'), t('customers.vehicles'), t('customers.joinDate'), t('common.actions')]}>
          {data?.data?.customers?.length > 0 ? (
            data.data.customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-bold text-slate-900">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-slate-600">{customer.email || t('customers.noEmail')}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{customer.phoneNumber}</div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight bg-blue-50 text-blue-700 border border-blue-100">
                    {t('customers.vehiclesCount', { count: customer.vehicles?.length || 0 })}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState message={t('customers.empty')} icon={Users} />
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <p>{t('common.page')} {page} {t('common.of')} {data?.data?.totalPages || 1}</p>
        <div className={`flex ${t('dir') === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-bold">
            {t('common.previous')}
          </button>
          <button 
            disabled={page >= (data?.data?.totalPages || 1)}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-bold">
            {t('common.next')}
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedCustomer ? t('customers.editCustomer') : t('customers.addCustomer')}
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
