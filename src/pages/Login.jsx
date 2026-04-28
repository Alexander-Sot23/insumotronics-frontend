import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/CompStock-logo-01.png';

const Login = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('sendData', JSON.stringify({ code, password }));

      const response = await apiClient.post('/api/login', formData, {
        headers: {
          'Content-Type': undefined
        }
      });

      if (response.data && response.data.token) {
        login(response.data);
        navigate('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.message || 
                       'Credenciales inválidas o error de conexión.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
        {/* Logo Centered */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="CompSTOCK Logo" 
            className="w-32 md:w-40 transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Title Area */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-slate-900 mb-1">Iniciar Sesión</h1>
          <p className="text-slate-400 font-light tracking-[0.2em] uppercase text-[9px]">
            Portal de Acceso CompSTOCK
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-8">
          <div className="space-y-6">
            {/* Code Input */}
            <div className="relative border-b border-slate-200 focus-within:border-indigo-600 transition-all duration-300 pb-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">
                Código de Usuario
              </label>
              <div className="flex items-center">
                <User size={14} className="text-slate-300 mr-3" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-200 font-light text-sm"
                  placeholder="ej. 2024001"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative border-b border-slate-200 focus-within:border-indigo-600 transition-all duration-300 pb-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">
                Contraseña
              </label>
              <div className="flex items-center">
                <Lock size={14} className="text-slate-300 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-200 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-[10px] font-light">
              * {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-900 text-white font-medium py-3.5 rounded-sm tracking-[0.2em] uppercase text-[9px] transition-all duration-500 shadow-lg shadow-slate-100 relative overflow-hidden group"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>Ingresar</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Minimal Footer */}
        <footer className="mt-12 text-[8px] text-slate-300 tracking-[0.4em] uppercase text-center">
          CompSTOCK • 2026
        </footer>
      </div>
    </div>


  );
};

export default Login;
