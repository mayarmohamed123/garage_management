import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  Package, 
  FileText, 
  UserCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Technician', 'Accountant'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['Admin', 'Manager'] },
    { name: 'Vehicles', href: '/vehicles', icon: Car, roles: ['Admin', 'Manager'] },
    { name: 'Service Orders', href: '/service-orders', icon: Wrench, roles: ['Admin', 'Manager', 'Technician'] },
    { name: 'Inventory', href: '/products', icon: Package, roles: ['Admin', 'Manager'] },
    { name: 'Invoices', href: '/invoices', icon: FileText, roles: ['Admin', 'Manager', 'Accountant'] },
    { name: 'Employees', href: '/employees', icon: UserCircle, roles: ['Admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col border-r border-slate-800`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-white font-bold text-xl tracking-tight">GaragePro</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6 flex-1 px-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-blue-500' : ''} />
                {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">
             {navigation.find(n => n.href === location.pathname)?.name || 'Management System'}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="text-right">
               <p className="text-sm font-semibold text-slate-900 leading-none">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{user?.role}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm">
                {user?.firstName?.charAt(0)}
             </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
