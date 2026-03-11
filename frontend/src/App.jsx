import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CustomersPage from './pages/customers/CustomersPage';
import VehiclesPage from './pages/customers/VehiclesPage';
import InventoryPage from './pages/inventory/InventoryPage';
import ServiceOrdersPage from './pages/service-orders/ServiceOrdersPage';
import CreateServiceOrder from './pages/service-orders/CreateServiceOrder';
import ServiceOrderDetail from './pages/service-orders/ServiceOrderDetail';
import InvoicesPage from './pages/billing/InvoicesPage';
import InvoiceDetail from './pages/billing/InvoiceDetail';
import EmployeesPage from './pages/employees/EmployeesPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/products" element={<InventoryPage />} />
          <Route path="/service-orders" element={<ServiceOrdersPage />} />
          <Route path="/service-orders/create" element={<CreateServiceOrder />} />
          <Route path="/service-orders/:id" element={<ServiceOrderDetail />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
