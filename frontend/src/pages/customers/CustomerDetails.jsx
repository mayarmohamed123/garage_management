import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCustomerQuery } from '../../services/customerService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Calendar, 
  ChevronLeft,
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';

const CustomerDetails = () => {
  const { id } = useParams();
  const { data: customerData, isLoading, error } = useGetCustomerQuery(id);

  if (isLoading) return <div className="flex justify-center items-center h-96 animate-pulse text-slate-400">Loading profile...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-3xl border border-red-100 italic">Error loading customer profile.</div>;

  const customer = customerData?.data;

  return (
    <div className="space-y-8 pb-12">
      <Link 
        to="/customers" 
        className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm tracking-tight transition-colors group"
      >
        <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <User size={120} />
          </div>
          <div className="relative z-10">
            <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black mb-6 shadow-xl shadow-blue-600/30">
              {customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{customer?.firstName} {customer?.lastName}</h2>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Active Customer</p>
            
            <div className="mt-10 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-medium">{customer?.email || 'Not Provided'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-medium">{customer?.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Address</p>
                  <p className="text-sm font-medium">{customer?.address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Calendar size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Customer Since</p>
                  <p className="text-sm font-medium">{new Date(customer?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vehicles Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center">
                <Car size={24} className="mr-3 text-blue-600" /> Owned Vehicles
              </h3>
              <button className="py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all border border-slate-200">
                Register New
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer?.vehicles?.length > 0 ? (
                customer.vehicles.map((vehicle) => (
                  <Link 
                    key={vehicle.id} 
                    to={`/vehicles/${vehicle.id}`}
                    className="p-5 border border-slate-100 rounded-3xl hover:border-blue-500/30 hover:bg-blue-50/30 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{vehicle.year} {vehicle.make}</p>
                        <h4 className="text-lg font-black text-slate-900">{vehicle.model}</h4>
                        <div className="mt-3 inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black tracking-tighter text-slate-600">
                          {vehicle.licensePlate}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-3xl text-sm text-slate-400 italic">
                  No vehicles registered for this customer.
                </div>
              )}
            </div>
          </div>

          {/* Service History Summary */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center">
                <Wrench size={24} className="mr-3 text-blue-600" /> Recent Service History
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* This would ideally come from another query or be nested in user data */}
              <div className="text-center py-10 text-slate-400 text-sm italic">
                Select a vehicle above to view its detailed service history.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
