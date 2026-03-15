import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetServiceOrderQuery, 
  useUpdateServiceOrderStatusMutation,
  useAddPartToOrderMutation,
  useRemovePartFromOrderMutation,
  useUpdateServiceOrderMutation
} from '../../services/serviceOrderService';
import { useGetProductsQuery } from '../../services/productService';
import { useGenerateInvoiceMutation } from '../../services/invoiceService';
import { useGetEmployeesQuery } from '../../services/employeeService';
import Modal from '../../components/ui/Modal';
import { 
  Wrench, 
  User, 
  Car, 
  Clock, 
  Package, 
  Plus, 
  Trash2, 
  FileText, 
  TrendingUp,
  RotateCcw,
  AlertCircle,
  X
} from 'lucide-react';

const ServiceOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: orderData, isLoading: isLoadingOrder, isError: isLoadError } = useGetServiceOrderQuery(id);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateServiceOrderStatusMutation();
  const [updateOrder] = useUpdateServiceOrderMutation();
  const [addPart, { isLoading: isAddingPart }] = useAddPartToOrderMutation();
  const [removePart] = useRemovePartFromOrderMutation();
  const [generateInvoice, { isLoading: isGeneratingInvoice }] = useGenerateInvoiceMutation();
  
  const { data: productData } = useGetProductsQuery({ limit: 100 });
  const { data: employeeData } = useGetEmployeesQuery();
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [error, setError] = useState('');

  if (isLoadingOrder) return <div className="p-20 text-center animate-pulse text-slate-400">Loading order details...</div>;
  
  if (isLoadError || !orderData?.data) return (
    <div className="p-20 text-center">
      <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 inline-block max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Service Order Not Found</h3>
        <p className="text-sm mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/service-orders')} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
          Back to Orders
        </button>
      </div>
    </div>
  );

  const order = orderData.data;

  const isAdminOrManager = ['Admin', 'Manager'].includes(user?.role);
  const isTechnician = user?.role === 'Technician';
  const isAccountant = user?.role === 'Accountant';

  const handleStatusUpdate = async (newStatus) => {
    setError('');
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      setError(err.data?.message || 'Failed to update status');
    }
  };

  const handleGenerateInvoice = async () => {
    setError('');
    try {
      const res = await generateInvoice(id).unwrap();
      navigate(`/invoices/${res.data.id}`);
    } catch (err) {
      setError(err.data?.message || 'Failed to generate invoice');
    }
  };

  const handleAssignTechnician = async (techId) => {
    setError('');
    try {
      await updateOrder({ id, technicianId: techId }).unwrap();
      setIsTechModalOpen(false);
    } catch (err) {
      setError(err.data?.message || 'Failed to assign technician');
    }
  };

  const handleAddPart = async () => {
    if (!selectedProduct) return;
    setError('');
    try {
      await addPart({ orderId: id, productId: selectedProduct, quantity }).unwrap();
      setSelectedProduct('');
      setQuantity(1);
    } catch (err) {
      setError(err.data?.message || 'Failed to add part');
    }
  };

  const totals = {
    parts: order.products?.reduce((sum, p) => sum + (parseFloat(p.ServicePart.unitPrice) * p.ServicePart.quantity), 0) || 0,
    labor: parseFloat(order.laborCost) || 0
  };
  const grandTotal = totals.parts + totals.labor;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/service-orders')} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
             <RotateCcw size={20} className="text-slate-500" />
           </button>
           <div>
              <h2 className="text-2xl font-bold text-slate-900">Order #{order.orderNumber}</h2>
              <p className="text-slate-500 text-sm">Created on {new Date(order.createdAt).toLocaleString()}</p>
           </div>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm shadow-sm outline-none"
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={isUpdatingStatus || isAccountant}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {(!isTechnician || order.status === 'Completed') && (
            <button 
              onClick={handleGenerateInvoice}
              disabled={isGeneratingInvoice || order.status === 'Cancelled' || isTechnician}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isGeneratingInvoice ? 'Generating...' : 'Generate Invoice'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <User size={16} className="mr-2" /> Customer Information
                </h4>
                <p className="text-lg font-bold text-slate-900">{order.vehicle?.customer?.firstName} {order.vehicle?.customer?.lastName}</p>
                <p className="text-slate-500">{order.vehicle?.customer?.phoneNumber}</p>
                <p className="text-sm border-t border-slate-50 mt-3 pt-3 text-slate-400">{order.vehicle?.customer?.address || 'No address provided'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <Car size={16} className="mr-2" /> Vehicle Information
                </h4>
                <p className="text-lg font-bold text-slate-900">{order.vehicle?.make} {order.vehicle?.model} ({order.vehicle?.year})</p>
                <p className="font-mono font-bold text-blue-600">{order.vehicle?.licensePlate}</p>
                <p className="text-[10px] uppercase text-slate-400 mt-2 tracking-widest font-bold">VIN: {order.vehicle?.vin || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h4 className="flex items-center text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                <FileText size={16} className="mr-2" /> Problem Description
             </h4>
             <p className="text-slate-700 leading-relaxed font-medium">{order.description}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h4 className="flex items-center text-sm font-bold text-slate-800 uppercase tracking-wider">
                    <Package size={16} className="mr-2" /> Parts & Consumables
                </h4>
             </div>
             <div className="p-6">
                {!isAccountant && (
                  <div className="flex gap-4 mb-6">
                      <select 
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium"
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                      >
                          <option value="">Select a part to add...</option>
                          {productData?.data?.products?.map(p => (
                              <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>{p.name} (${p.price}) - Stock: {p.stockQuantity}</option>
                          ))}
                      </select>
                      <input 
                          type="number" 
                          min="1"
                          className="w-20 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold text-center"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />
                      <button 
                          onClick={handleAddPart}
                          disabled={isAddingPart}
                          className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                      >
                          <Plus size={20} />
                      </button>
                  </div>
                )}

                <div className="space-y-3">
                    {order.products?.length > 0 ? order.products.map(part => (
                        <div key={part.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                            <div className="flex items-center">
                                <Package size={16} className="text-slate-400 mr-3" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{part.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Qty: {part.ServicePart.quantity} @ ${part.ServicePart.unitPrice}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-bold text-slate-900">${(parseFloat(part.ServicePart.unitPrice) * part.ServicePart.quantity).toFixed(2)}</span>
                                {!isAccountant && (
                                  <button 
                                      onClick={() => removePart({ orderId: id, partId: part.id })}
                                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-6 text-slate-400 text-sm">No parts added yet.</div>
                    )}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                </div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 flex items-center">
                    <Clock size={14} className="mr-2" /> Cost Breakdown
                </h4>
                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-medium">Labor Cost</span>
                        <span className="text-xl font-bold">${totals.labor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-medium">Parts Total</span>
                        <span className="text-xl font-bold">${totals.parts.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 mt-6 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">Grand Total</span>
                        <span className="text-4xl font-extrabold text-blue-400 tracking-tighter">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Technician Assigned</h4>
                <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                        {order.technician?.firstName ? order.technician.firstName.charAt(0) : '?'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{order.technician ? `${order.technician.firstName} ${order.technician.lastName}` : 'Unassigned'}</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Main Technician</p>
                    </div>
                </div>
                {isAdminOrManager && (
                  <button 
                      onClick={() => setIsTechModalOpen(true)}
                      className="w-full mt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                      Change assignment
                  </button>
                )}
            </div>
        </div>
      </div>

      <Modal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} title="Assign Technician">
        <div className="space-y-3">
          {employeeData?.data?.employees?.filter(e => e.role === 'Technician' || e.role === 'Admin').map(tech => (
            <button
               key={tech.id}
               onClick={() => handleAssignTechnician(tech.id)}
               className="w-full flex items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all text-left"
            >
               <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 shadow-sm">
                  {tech.firstName.charAt(0)}
               </div>
               <div>
                  <p className="font-bold text-slate-900">{tech.firstName} {tech.lastName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{tech.role}</p>
               </div>
            </button>
          ))}
          {(!employeeData?.data?.employees || employeeData.data.employees.length === 0) && (
             <div className="text-center py-6 text-slate-400 text-sm">No eligible staff found.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

class ServiceOrderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 inline-block max-w-lg text-left">
            <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
            <p className="text-sm mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.href = '/service-orders'} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
              Back to Orders
            </button>
          </div>
        </div>
      );
    }
    return <ServiceOrderDetail />;
  }
}

export default ServiceOrderErrorBoundary;
