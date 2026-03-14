import React, { useState } from 'react';
import { useGetVehiclesQuery, useDeleteVehicleMutation } from '../../services/vehicleService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import VehicleForm from './VehicleForm';
import { Search, Plus, Car, Edit, Trash2, AlertCircle, X } from 'lucide-react';

const VehiclesPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const { data, isLoading, error: loadError } = useGetVehiclesQuery({ search, page, limit: 10 });
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [error, setError] = useState('');

  const handleOpenModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
        try {
            await deleteVehicle(id).unwrap();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete vehicle');
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vehicles</h2>
          <p className="text-slate-500 text-sm mt-1">Track and manage registered vehicles for maintenance.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Register Vehicle
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by license plate, make, or model..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          Loading vehicles...
        </div>
      ) : loadError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Error loading vehicles.
        </div>
      ) : (
        <Table headers={['Vehicle Info', 'License Plate', 'Owner', 'Year', 'Actions']}>
          {data?.data?.vehicles?.length > 0 ? (
            data.data.vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="flex items-center">
                  <div className="h-10 w-10 min-w-[40px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                    <Car size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{vehicle.make} {vehicle.model}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{vehicle.color || 'Unknown Color'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-xs">
                    {vehicle.licensePlate}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold text-slate-900">
                    {vehicle.customer?.firstName} {vehicle.customer?.lastName}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-500">{vehicle.year}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(vehicle)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(vehicle.id)}
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
              <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                No vehicles found.
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      {/* Pagination & Modal */}
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
      >
        <VehicleForm 
          vehicle={selectedVehicle} 
          onSuccess={handleCloseModal} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default VehiclesPage;
