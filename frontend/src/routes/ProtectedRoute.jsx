import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = () => {
    const { token } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export default ProtectedRoute;
