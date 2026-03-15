import React, { useState } from 'react';
import { useGetVehiclesQuery, useDeleteVehicleMutation } from '../../services/vehicleService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import VehicleForm from '../customers/VehicleForm';
import { Search, Plus, Car, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';

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
      <PageHeader 
        title="Vehicles"
        description="Track and manage registered vehicles for maintenance."
        actionText="Register Vehicle"
        onAction={() => handleOpenModal()}
      />

      <SearchInput 
        placeholder="Search by license plate, make, or model..."
        value={search}
        onChange={setSearch}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Loading vehicles..." />
      ) : loadError ? (
        <ErrorState message="Error loading vehicles." />
      ) : (
        <Table headers={['Vehicle Info', 'License Plate', 'Owner', 'Year', 'Actions']}>
          {data?.data?.vehicles?.length > 0 ? (
            data.data.vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="flex items-center">
                  <div className="h-10 w-10 min-w-[40px] rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mr-3 border border-blue-100">
                    <Car size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{vehicle.make} {vehicle.model}</div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{vehicle.color || 'Unknown Color'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono font-extrabold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 text-xs tracking-tighter">
                    {vehicle.licensePlate}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-bold text-slate-700">
                    {vehicle.customer?.firstName} {vehicle.customer?.lastName}
                  </div>
                </TableCell>
                <TableCell className="font-extrabold text-slate-500 text-sm">{vehicle.year}</TableCell>
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
              <TableCell colSpan={5}>
                <EmptyState message="No vehicles found in registry." icon={Car} />
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
