import React, { useState, useEffect } from 'react';
import { useRegisterVehicleMutation, useUpdateVehicleMutation } from '../../services/vehicleService';
import { useGetCustomersQuery } from '../../services/customerService';

const VehicleForm = ({ vehicle, defaultCustomerId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    color: '',
    customerId: defaultCustomerId || ''
  });
  const [error, setError] = useState('');

  const [registerVehicle, { isLoading: isCreating }] = useRegisterVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const { data: customerData } = useGetCustomersQuery({ limit: 100 });

  useEffect(() => {
    const timer = setTimeout(() => {
        if (vehicle && vehicle.id !== formData.id) {
            setFormData({
                id: vehicle.id,
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: vehicle.year || new Date().getFullYear(),
                licensePlate: vehicle.licensePlate || '',
                vin: vehicle.vin || '',
                color: vehicle.color || '',
                customerId: vehicle.customerId || ''
            });
        } else if (defaultCustomerId && !formData.customerId) {
            setFormData(prev => ({ ...prev, customerId: defaultCustomerId }));
        }
    }, 0);
    return () => clearTimeout(timer);
  }, [vehicle, defaultCustomerId, formData.id, formData.customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (vehicle) {
        await updateVehicle({ id: vehicle.id, ...formData }).unwrap();
      } else {
        await registerVehicle(formData).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(err.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Make</label>
          <input
            type="text"
            required
            placeholder="e.g. Toyota"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Model</label>
          <input
            type="text"
            required
            placeholder="e.g. Corolla"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">License Plate</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
          value={formData.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
        />
      </div>

      {!defaultCustomerId && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Owner (Customer)</label>
          <select
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          >
            <option value="">Select a customer</option>
            {customerData?.data?.customers?.map(c => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.phoneNumber})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">VIN (Optional)</label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.vin}
          onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
        >
          {isCreating || isUpdating ? 'Saving...' : vehicle ? 'Update' : 'Register Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
