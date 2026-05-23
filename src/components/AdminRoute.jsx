import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAdmin, isAdminView, loading } = useAuth();

  if (!loading && (!isAdmin || !isAdminView)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
