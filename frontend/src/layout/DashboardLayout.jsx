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
  X,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logout } from '../features/auth/authSlice';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const navigation = [
    { name: t('common.dashboard'), href: '/', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Technician', 'Accountant'] },
    { name: t('common.customers'), href: '/customers', icon: Users, roles: ['Admin', 'Manager'] },
    { name: t('common.vehicles'), href: '/vehicles', icon: Car, roles: ['Admin', 'Manager'] },
    { name: t('common.serviceOrders'), href: '/service-orders', icon: Wrench, roles: ['Admin', 'Manager', 'Technician'] },
    { name: t('common.inventory'), href: '/products', icon: Package, roles: ['Admin', 'Manager'] },
    { name: t('common.invoices'), href: '/invoices', icon: FileText, roles: ['Admin', 'Manager', 'Accountant'] },
    { name: t('common.employees'), href: '/employees', icon: UserCircle, roles: ['Admin'] },
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
                {isSidebarOpen && <span className={`${i18n.language === 'ar' ? 'mr-3' : 'ml-3'} font-medium text-sm`}>{item.name}</span>}
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
            {isSidebarOpen && <span className={`${i18n.language === 'ar' ? 'mr-3' : 'ml-3'} font-medium text-sm`}>{t('common.logout')}</span>}
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
          <div className={`flex items-center ${i18n.language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
             <button 
               onClick={toggleLanguage}
               className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2"
               title={i18n.language === 'en' ? 'Switch to Arabic' : 'تغيير للإنجليزية'}
             >
                <Languages size={20} />
                <span className="text-sm font-bold uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
             </button>
             <div className={i18n.language === 'ar' ? 'text-left' : 'text-right'}>
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
