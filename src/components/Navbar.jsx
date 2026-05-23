import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, LogOut, Menu, X, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/insu-logo-03.png';
import { useState } from 'react';

const Navbar = () => {
  const { isAdmin, isAdminView, logout, toggleAdminViewMode } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuOptions = isAdminView
    ? [
        { name: 'Inicio', path: '/home' },
        { name: 'Inventario', path: '/inventory' },
        { name: 'Gestionar inventario', path: '/manage-inventory' },
        { name: 'Gestionar Pedidos', path: '/manage-orders' }
      ] 
    : [
        { name: 'Inicio', path: '/home' },
        { name: 'Inventario', path: '/inventory' }
      ];

  const isActive = (path) => location.pathname === path;

  const handleToggleViewMode = () => {
    const leavingAdminView = isAdminView;
    toggleAdminViewMode();
    setIsMenuOpen(false);

    if (leavingAdminView && location.pathname.startsWith('/manage-')) {
      navigate('/home');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Insumotronics" className="h-8 md:h-10" />
        </div>

        {/* Center: Navigation Options (Desktop) */}
        <div className="hidden lg:flex items-center space-x-12">
          {menuOptions.map((option) => (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-medium relative group ${
                isActive(option.path) ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-400'
              }`}
            >
              {option.name}
              {/* Active Indicator Line */}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                isActive(option.path) ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
          ))}
        </div>

        {/* Right: Icons & Actions */}
        <div className="hidden lg:flex items-center space-x-8">
          {isAdmin && (
            <button
              onClick={handleToggleViewMode}
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isAdminView
                  ? 'border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-white'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-100'
              }`}
              title={isAdminView ? 'Cambiar a vista estudiante/profesor' : 'Cambiar a vista administrador'}
            >
              {isAdminView ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
              {isAdminView ? 'Vista Admin' : 'Vista Usuario'}
            </button>
          )}

          <button 
            onClick={() => navigate('/profile')}
            className={`transition-colors ${isActive('/profile') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
            title="Mi Perfil"
          >
            <User size={20} strokeWidth={1.5} />
          </button>

          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <span className="text-[11px] font-medium text-slate-600 tracking-wider uppercase">${(totalPrice || 0).toFixed(2)}</span>
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              {(totalItems || 0) > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={logout}
            className="text-slate-400 hover:text-red-500 transition-colors pl-4"
            title="Cerrar Sesión"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={() => navigate('/cart')} className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ShoppingCart size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {menuOptions.map((option) => (
              <button
                key={option.path}
                onClick={() => {
                  navigate(option.path);
                  setIsMenuOpen(false);
                }}
                className={`text-left text-[11px] uppercase tracking-[0.2em] font-medium ${
                  isActive(option.path) ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          <div className="h-px bg-slate-100 w-full"></div>
          {isAdmin && (
            <>
              <button
                onClick={handleToggleViewMode}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                  isAdminView
                    ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <span>{isAdminView ? 'Vista Admin' : 'Vista Usuario'}</span>
                {isAdminView ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
              </button>
              <div className="h-px bg-slate-100 w-full"></div>
            </>
          )}
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                <User size={20} className={isActive('/profile') ? 'text-indigo-600' : 'text-slate-400'} />
              </button>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-red-500 text-[11px] uppercase tracking-widest font-bold"
            >
              <span>Salir</span>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
