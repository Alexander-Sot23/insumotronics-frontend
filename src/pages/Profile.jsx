import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  IdCard, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Shield, 
  LogOut, 
  ChevronRight,
  Loader2,
  BookOpen,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import bannerImg from '../assets/CUVALLES_banner.jpg';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Assuming user.code is available from login
        const data = await userService.getUserByCode(user?.role, user?.code);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('No se pudo cargar la información del perfil.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.code) {
      fetchProfile();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'INACTIVE': return 'bg-red-50 text-red-600 border-red-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const formatRole = (role) => {
    const r = role?.replace('ROLE_', '').toUpperCase();
    if (r === 'STUDENT') return 'Estudiante';
    if (r === 'ADMIN') return 'Administrador';
    if (r === 'TEACHER') return 'Profesor';
    return r || 'Usuario';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="bg-red-50 border border-red-100 p-8 rounded-sm text-center space-y-4">
            <User className="mx-auto text-red-300" size={48} />
            <h2 className="text-xl font-serif text-slate-900">{error || 'Error al cargar perfil'}</h2>
            <button 
              onClick={() => navigate('/home')}
              className="px-6 py-2 bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold rounded-sm"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={bannerImg} 
              alt="CUVALLES Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <span className="text-3xl md:text-4xl font-serif font-bold">
                    {profileData.name[0]}{profileData.lastname[0]}
                  </span>
                </div>
              </div>
              
              <div className="flex-grow space-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-serif text-slate-900 font-bold">
                    {profileData.name} {profileData.lastname}
                  </h1>
                </div>
                <p className="text-slate-400 font-light flex items-center gap-2">
                  <Shield size={14} className="text-indigo-400" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">{formatRole(profileData.role)}</span>
                </p>
              </div>

              <div className="pb-2">
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-all border border-red-100"
                >
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <GraduationCap size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest">Información Académica</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carrera</p>
                  <p className="text-slate-700 font-medium">{profileData.career || 'Ingeniería Mecatrónica'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel Académico</p>
                  <p className="text-slate-700 font-medium">{profileData.academicLevel || 'LICENCIATURA'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grado / Semestre</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-bold text-indigo-600">{profileData.degree || '0'}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Semestre</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código Universitario</p>
                  <p className="text-slate-900 font-mono font-bold text-lg">{profileData.code}</p>
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <IdCard size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest">Detalles de la Cuenta</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correo Electrónico</p>
                    <p className="text-sm text-slate-700">{profileData.email || 'correo@universidad.edu'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha de Registro</p>
                    <p className="text-sm text-slate-700">{formatDate(profileData.createdDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Clock size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Último Acceso</p>
                    <p className="text-sm text-slate-700">{formatDate(profileData.lastLogin)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verificación</p>
                    <p className="text-xs font-bold text-emerald-600 uppercase">Usuario Verificado por la Institución</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Atajos Rápidos</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/inventory')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-widest">Ver Inventario</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-widest">Mis Pedidos</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 text-center">
        <p className="text-slate-300 text-[10px] font-medium uppercase tracking-[0.4em]">
          Plataforma de Gestión CompSTOCK • 2026
        </p>
      </footer>
    </div>
  );
};

export default Profile;
