import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateServiceOrderMutation } from '../../services/serviceOrderService';
import { useGetCustomersQuery } from '../../services/customerService';
import { useGetVehiclesQuery } from '../../services/vehicleService';
import { useGetEmployeesQuery } from '../../services/employeeService';
import { User, Car, Calendar, ClipboardList, PenTool, UserCog } from 'lucide-react';

const CreateServiceOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    technicianId: '',
    description: '',
    estimatedCompletionDate: '',
    laborCost: '0'
  });
  const [error, setError] = useState('');

  const [createOrder, { isLoading: isCreating }] = useCreateServiceOrderMutation();
  const { data: customerData } = useGetCustomersQuery({ limit: 100 });
  const { data: employeeData } = useGetEmployeesQuery();
  const { data: vehicleData } = useGetVehiclesQuery({ 
    customerId: formData.customerId, 
    limit: 100 
  }, { skip: !formData.customerId });

  const technicians = employeeData?.data?.employees?.filter(e => e.role === 'Technician') || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleId) return setError('Please select a vehicle');
    if (!formData.technicianId) return setError('Please select a technician');
    setError('');
    try {
      await createOrder(formData).unwrap();
      navigate('/service-orders');
    } catch (err) {
      setError(err.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Service Order</h2>
        <p className="text-slate-500 mt-2">Initialize a new maintenance task for a customer vehicle.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Selection */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <User size={18} className="mr-2 text-blue-600" /> Customer
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value, vehicleId: '' })}
            >
              <option value="">Select a customer</option>
              {customerData?.data?.customers?.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <Car size={18} className="mr-2 text-purple-600" /> Vehicle
            </label>
            <select
              required
              disabled={!formData.customerId}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none disabled:opacity-50"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            >
              <option value="">{formData.customerId ? 'Select a vehicle' : 'Select customer first'}</option>
              {vehicleData?.data?.vehicles?.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Technician Selection */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <UserCog size={18} className="mr-2 text-indigo-600" /> Assigned Technician
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
              value={formData.technicianId}
              onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
            >
              <option value="">Select a technician</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <Calendar size={18} className="mr-2 text-green-600" /> Estimated Completion
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.estimatedCompletionDate}
              onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center text-sm font-bold text-slate-700">
            <ClipboardList size={18} className="mr-2 text-orange-600" /> Problem Description
          </label>
          <textarea
            required
            rows="4"
            placeholder="Describe the issues reported by the customer..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 md:col-start-2">
            <label className="flex items-center text-sm font-bold text-slate-700">
              <PenTool size={18} className="mr-2 text-blue-600" /> Initial Labor Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.laborCost}
              onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/service-orders')}
            className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="flex-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isCreating ? 'Creating Order...' : 'Create Service Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateServiceOrder;
