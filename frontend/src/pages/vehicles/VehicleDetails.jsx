import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetVehicleQuery } from '../../services/vehicleService';
import { useGetServiceOrdersQuery } from '../../services/serviceOrderService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { 
  Car, 
  User, 
  Calendar, 
  Hash, 
  Wrench, 
  History, 
  ChevronLeft,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const { data: vehicleData, isLoading: vehicleLoading } = useGetVehicleQuery(id);
  const { data: historyData, isLoading: historyLoading } = useGetServiceOrdersQuery({ vehicleId: id });

  if (vehicleLoading) return <div className="flex justify-center items-center h-96 animate-pulse text-slate-400">Loading vehicle info...</div>;

  const vehicle = vehicleData?.data;
  const history = historyData?.data?.serviceOrders || [];

  return (
    <div className="space-y-8 pb-12">
      <Link 
        to="/vehicles" 
        className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm tracking-tight transition-colors group"
      >
        <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Vehicles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicle Spec Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Car size={100} />
             </div>
             <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Vehicle Specifications</h2>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">{vehicle?.make} {vehicle?.model}</h3>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Year</p>
                    <p className="text-lg font-black text-slate-900">{vehicle?.year}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Plate</p>
                    <p className="text-lg font-black text-slate-900">{vehicle?.licensePlate}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">VIN</p>
                    <p className="text-sm font-black text-slate-900 tracking-widest font-mono">{vehicle?.vin || 'NOT_FOUND'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Color</p>
                    <div className="flex items-center mt-1">
                        <div className="h-4 w-4 rounded-full mr-3 border border-slate-200" style={{ backgroundColor: vehicle?.color?.toLowerCase() }} />
                        <p className="text-sm font-bold text-slate-800 capitalize">{vehicle?.color || 'N/A'}</p>
                    </div>
                </div>
             </div>

             <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <User size={14} className="mr-2" /> Owner Information
                </h4>
                <Link to={`/customers/${vehicle?.customerId}`} className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100 group transition-all">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 mr-4">
                        {vehicle?.customer?.firstName?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {vehicle?.customer?.firstName} {vehicle?.customer?.lastName}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">{vehicle?.customer?.phoneNumber}</p>
                    </div>
                </Link>
             </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg font-bold flex items-center mb-6">
                    <ShieldCheck size={20} className="mr-3 text-green-400" /> Maintenance Status
                </h3>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Service</p>
                    <p className="text-sm font-medium">
                        {history.length > 0 ? new Date(history[0].createdAt).toLocaleDateString() : 'No History'}
                    </p>
                </div>
                <button className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                    Schedule Repair
                </button>
             </div>
          </div>
        </div>

        {/* Maintenance History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center">
                <History size={24} className="mr-3 text-blue-600" /> Full Service History
              </h3>
              <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {history.length} Records Found
              </div>
            </div>

            {historyLoading ? (
              <div className="py-20 text-center animate-pulse text-slate-400">Loading history...</div>
            ) : (
              <Table headers={['Order #', 'Service Description', 'Status', 'Date', 'Cost']}>
                {history.length > 0 ? (
                  history.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-black text-blue-600">#{order.orderNumber}</TableCell>
                      <TableCell className="max-w-xs truncate font-medium">{order.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-black text-slate-900">${parseFloat(order.laborCost).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">
                        No service history recorded for this vehicle.
                     </TableCell>
                  </TableRow>
                )}
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
