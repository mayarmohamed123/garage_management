import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../../services/customerService';

const CustomerForm = ({ customer, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  useEffect(() => {
    if (customer && customer.id !== formData.id) {
        const timer = setTimeout(() => {
            setFormData({
                id: customer.id,
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                email: customer.email || '',
                phoneNumber: customer.phoneNumber || '',
                address: customer.address || ''
            });
        }, 0);
        return () => clearTimeout(timer);
    }
  }, [customer, formData.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (customer) {
        await updateCustomer({ id: customer.id, ...formData }).unwrap();
      } else {
        await createCustomer(formData).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(err.data?.message || t('common.error') || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{t('customers.firstName')}</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{t('customers.lastName')}</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('customers.email')}</label>
        <input
          type="email"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('customers.phone')}</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('customers.address')}</label>
        <textarea
          rows="3"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
        >
          {isCreating || isUpdating ? t('customers.saving') : customer ? t('common.save') : t('common.add')}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
