import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si ya terminó de cargar y no está autenticado, redirigir
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Contenido de fondo (se difumina mientras carga) */}
      <div className={loading ? 'blur-sm pointer-events-none' : ''}>
        <Outlet />
      </div>

      {/* Overlay de carga premium */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white flex flex-col items-center space-y-4 max-w-[260px] w-full text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-900 mb-1">Cargando Sesión</h3>
              <p className="text-slate-400 font-light tracking-widest text-[9px] uppercase">Espera un momento...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
