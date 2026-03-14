import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Car, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  ClipboardList,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetDashboardStatsQuery } from '../../services/dashboardService';
import { useGetProductsQuery } from '../../services/productService';
import { useGetServiceOrdersQuery } from '../../services/serviceOrderService';

const DashboardCard = (props) => {
  const { title, value, color, trend, trendValue } = props;
  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <props.icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'} bg-slate-50 px-2 py-1 rounded-full`}>
            <TrendingUp size={12} className="mr-1" /> {trendValue}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: statsData } = useGetDashboardStatsQuery();
  const { data: lowStockData } = useGetProductsQuery({ limit: 5 });
  
  // Conditionally fetch orders based on role
  const orderParams = user?.role === 'Technician' ? { technicianId: user.id, limit: 10 } : { limit: 10 };
  const { data: ordersData } = useGetServiceOrdersQuery(orderParams);

  const stats = statsData?.data || {
    totalCustomers: '0',
    totalVehicles: '0',
    activeServiceOrders: '0',
    monthlyRevenue: '0.00'
  };

  const isAdminOrManager = ['Admin', 'Manager'].includes(user?.role);
  const isTechnician = user?.role === 'Technician';
  const isAccountant = user?.role === 'Accountant';

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
             {isTechnician ? 'My Maintenance Hub' : isAccountant ? 'Finance Overview' : 'Center Overview'}
          </h1>
          <p className="text-slate-500 mt-1">
             {isTechnician ? 'Manage your repair schedule and task updates.' : 
              isAccountant ? 'Monitor billing, payments, and financial health.' : 
              'Operational insights and real-time statistics for your garage.'}
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm">
           <span className="flex items-center py-2 px-4 bg-white rounded-xl border border-slate-100 font-bold text-slate-600 shadow-sm uppercase tracking-wider text-[10px]">
              <Clock size={16} className="mr-2 text-blue-500" /> Shift Active: {new Date().toLocaleDateString()}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdminOrManager && (
          <>
            <DashboardCard title="Total Customers" value={stats.totalCustomers} icon={Users} color="bg-blue-600" trend="up" trendValue="+12%" />
            <DashboardCard title="Vehicles in Registry" value={stats.totalVehicles} icon={Car} color="bg-purple-600" trend="up" trendValue="+8%" />
            <DashboardCard title="Active Orders" value={stats.activeServiceOrders} icon={Wrench} color="bg-orange-600" trend="down" trendValue="-2%" />
            <DashboardCard title="Monthly Revenue" value={`$${parseFloat(stats.monthlyRevenue).toLocaleString()}`} icon={DollarSign} color="bg-green-600" trend="up" trendValue="+24%" />
          </>
        )}
        {isTechnician && (
          <>
            <DashboardCard title="My Workload" value={ordersData?.data?.serviceOrders?.length || 0} icon={ClipboardList} color="bg-blue-600" />
            <DashboardCard title="Vehicles Ready" value="2" icon={Car} color="bg-green-600" />
            <DashboardCard title="Waiting Parts" value="1" icon={AlertTriangle} color="bg-orange-600" />
            <DashboardCard title="Efficiency" value="94%" icon={TrendingUp} color="bg-purple-600" />
          </>
        )}
        {isAccountant && (
          <>
            <DashboardCard title="Monthly Revenue" value={`$${parseFloat(stats.monthlyRevenue).toLocaleString()}`} icon={DollarSign} color="bg-green-600" trend="up" trendValue="+24%" />
            <DashboardCard title="Unpaid Invoices" value="4" icon={AlertTriangle} color="bg-red-600" />
            <DashboardCard title="Recent Payments" value="12" icon={CreditCard} color="bg-blue-600" />
            <DashboardCard title="Net Margin" value="18%" icon={TrendingUp} color="bg-purple-600" trend="up" trendValue="+2%" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <CheckCircle2 size={24} className="mr-3 text-blue-600" /> 
                    {isTechnician ? 'My Active Assignments' : 'Recent Activity'}
                </h2>
                <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
             </div>
             <div className="space-y-6">
                {(ordersData?.data?.serviceOrders || []).slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center space-x-4">
                       <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm group-hover:scale-110 transition-transform">
                          #{order.orderNumber}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                          <p className="text-xs text-slate-500">{order.vehicle?.make} {order.vehicle?.model} • <span className="text-blue-600 font-bold">{order.status}</span></p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-extrabold text-slate-900">${parseFloat(order.laborCost).toFixed(2)}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {(!ordersData?.data?.serviceOrders || ordersData.data.serviceOrders.length === 0) && (
                    <div className="text-center py-10 text-slate-400 text-sm">No tasks assigned yet.</div>
                )}
             </div>
          </div>

          {(isAdminOrManager || isAccountant) && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                        <BarChart3 size={24} className="mr-3 text-purple-600" /> Revenue Analytics
                    </h2>
                    <div className="flex space-x-2">
                        <span className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">Last 6 Months</span>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { month: 'Jan', amount: 4500 },
                            { month: 'Feb', amount: 5200 },
                            { month: 'Mar', amount: 4800 },
                            { month: 'Apr', amount: 6100 },
                            { month: 'May', amount: 5900 },
                            { month: 'Jun', amount: parseFloat(stats.monthlyRevenue || 0) },
                        ]}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="month" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                                itemStyle={{ color: '#8b5cf6', fontWeight: 800 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#8b5cf6" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           {isAdminOrManager && (
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <AlertTriangle size={120} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-8 relative z-10 flex items-center">
                   <AlertTriangle size={24} className="mr-3 text-red-500" /> Stock Alerts
                </h2>
                <div className="space-y-6 relative z-10">
                   {lowStockData?.data?.products?.filter(p => p.stock <= p.minStock).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                         <div>
                            <p className="text-sm font-bold text-red-900">{product.name}</p>
                            <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Qty: {product.stock} / Min: {product.minStock}</p>
                         </div>
                         <button className="p-2 bg-white rounded-lg text-red-600 shadow-sm hover:bg-red-500 hover:text-white transition-all">
                            <Plus size={16} />
                         </button>
                      </div>
                   ))}
                   {(!lowStockData?.data?.products?.some(p => p.stock <= p.minStock)) && (
                      <div className="text-center py-10 text-slate-400 text-sm italic">All items are sufficiently stocked.</div>
                   )}
                </div>
                <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                   Manage Inventory
                </button>
             </div>
           )}
           
           {(isTechnician || isAccountant) && (
             <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 text-white relative h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                   <AlertTriangle size={24} className="mr-3 text-blue-400" /> Daily Priorities
                </h2>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">High Priority</p>
                      <p className="text-sm font-medium">
                         {isTechnician ? 'Complete inspection for SO-1005' : 'Process payment for INV-998273'}
                      </p>
                   </div>
                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">General</p>
                      <p className="text-sm font-medium">
                         {isTechnician ? 'Review part availability for next 3 orders' : 'Send monthly statement to Top VIP customers'}
                      </p>
                   </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Quick Stats</p>
                   <div className="flex justify-between items-center bg-blue-600/10 p-4 rounded-2xl border border-blue-600/20">
                      <span className="text-xs font-bold text-blue-400">Shift Completion</span>
                      <span className="text-xl font-black text-white">68%</span>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
