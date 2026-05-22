import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Users, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import inventoryService from '../services/inventoryService';
import banner from '../assets/CUVALLES_banner.jpg';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReservations: 0,
    readyToPickUp: 0 // Nuevo para alumnos
  });
  const [recentReserves, setRecentReserves] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  useEffect(() => {
    if (isAdmin || user?.id || user?.userId) {
      fetchData();
    }
  }, [isAdmin, user?.id, user?.userId]);

  const fetchData = async () => {
    if (!isAdmin && !(user?.id || user?.userId)) return;
    
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Carga para ADMIN (Global)
        const [statsData, reservesData] = await Promise.all([
          inventoryService.getDashboardStats(),
          inventoryService.getRecentReserves(0, 5)
        ]);
        
        setStats({
          totalProducts: statsData.totalProducts || 0,
          totalReservations: statsData.totalReservations || 0,
          readyToPickUp: 0
        });
        
        if (reservesData && reservesData.content) {
          setRecentReserves(reservesData.content);
        }
      } else {
        // Carga para ESTUDIANTE / PROFESOR (Personal + Global)
        const [invData, studentStats, activeReserves] = await Promise.all([
          inventoryService.getAllProducts(user?.role, 0, 1),
          inventoryService.getStudentStats(user?.id || user?.userId),
          inventoryService.getActiveReserves(user?.id || user?.userId)
        ]);

        setStats({
          totalProducts: invData.totalElements || 0,
          totalReservations: studentStats.totalMyReserves || 0,
          readyToPickUp: studentStats.readyToPickUp || 0
        });

        setRecentReserves(activeReserves || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Institutional Banner */}
      <div className="w-full h-48 md:h-64 overflow-hidden relative border-b border-slate-100">
        <img 
          src={banner} 
          alt="Cuvalles Banner" 
          className="w-full h-full object-cover opacity-90 grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-xl py-4">
             <span className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] block mb-2 md:mb-4">Plataforma Académica</span>
             <h1 className="text-2xl md:text-4xl font-serif text-slate-900 leading-tight">Materiales para tus proyectos</h1>
          </div>
        </div>

        {/* Social Links - Bottom Right of Banner */}
        <div className="absolute bottom-6 right-6 flex items-center space-x-3">
          <a 
            href="https://www.cuvalles.udg.mx/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-slate-800 hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-sm"
            title="Sitio Web CUVALLES"
          >
            <Globe size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="https://www.facebook.com/cuvalles" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-slate-800 hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-sm"
            title="Facebook CUVALLES"
          >
            <Users size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="https://www.instagram.com/cuvalles/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-slate-800 hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-sm"
            title="Instagram CUVALLES"
          >
            <Camera size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              Bienvenido, {user?.name || 'Alexander'}
            </h2>
            <p className="text-slate-400 font-light text-lg leading-relaxed max-w-xl">
              Has ingresado al panel de control de <span className="text-slate-800 font-medium">CompSTOCK</span>. 
              {isAdmin 
                ? 'Monitorea el estado del inventario y gestiona las solicitudes de los estudiantes en tiempo real.'
                : 'Tu próximo gran proyecto comienza aquí. Explora nuestro catálogo de componentes y solicita los materiales necesarios para dar vida a tus circuitos e ideas.'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-50 border border-slate-100 rounded-sm hover:border-indigo-200 transition-all duration-500 group">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">
                {isAdmin ? 'Inventario Total' : 'Materiales Disponibles'}
              </h4>
              <p className="text-4xl font-serif text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {loading ? '...' : stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-light tracking-wide">
                {isAdmin ? 'Componentes registrados' : 'Listos para tus proyectos'}
              </p>
            </div>

            <div className="p-10 bg-slate-50 border border-slate-100 rounded-sm hover:border-indigo-200 transition-all duration-500 group">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">
                {isAdmin ? 'Reservas Totales' : 'Mis Reservas'}
              </h4>
              <p className="text-4xl font-serif text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {loading ? '...' : stats.totalReservations.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-light tracking-wide">
                {isAdmin ? 'Historial de solicitudes' : 'Pedidos realizados'}
              </p>
            </div>

            <div className="p-10 bg-slate-50 border border-slate-100 rounded-sm hover:border-indigo-200 transition-all duration-500 group">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">
                {isAdmin ? 'Estado Sistema' : 'Por Recoger'}
              </h4>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-sm ${
                  isAdmin ? 'bg-emerald-500 shadow-emerald-200' : 
                  (stats.readyToPickUp > 0 ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-300')
                }`}></div>
                <p className="text-3xl font-serif text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {isAdmin ? 'Activo' : stats.readyToPickUp}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 font-light tracking-wide">
                {isAdmin ? 'Sincronizado con backend' : 'Pedidos confirmados'}
              </p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="pt-20 border-t border-slate-50">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] uppercase tracking-[0.4em] text-slate-400 font-bold">
                {isAdmin ? 'Actividad Global' : 'Mis Solicitudes Activas'}
              </h3>
              {!isAdmin && (
                <button 
                  onClick={() => navigate('/inventory')}
                  className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Nuevo Pedido
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-sm"></div>
                ))}
              </div>
            ) : recentReserves.length === 0 ? (
              <p className="text-slate-400 text-sm font-light italic">No hay actividad reciente para mostrar.</p>
            ) : (
              <div className="space-y-6">
                {recentReserves.map((reserve, index) => (
                  <div key={reserve.id} className="flex items-center justify-between py-6 border-b border-slate-50 group cursor-pointer hover:pl-2 transition-all duration-300">
                    <div className="flex items-center space-x-6">
                      <span className="text-[10px] text-slate-300 font-bold">0{index + 1}</span>
                      <div>
                        <p className="text-sm text-slate-800 font-medium group-hover:text-indigo-600 transition-colors">
                          {isAdmin ? 'Reserva recibida' : 'Tu solicitud de material'} 
                          <span className="ml-2 text-[10px] text-slate-400 font-light">
                            Folio: {reserve.id.substring(0, 8).toUpperCase()}
                          </span>
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                            reserve.status === 'PENDIENTE' ? 'bg-amber-50 text-amber-600' :
                            reserve.status === 'CONFIRMADA' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {reserve.status}
                          </span>
                          <span className="text-[10px] text-slate-300 uppercase tracking-widest">
                            {formatDate(reserve.creationDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-slate-100 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
