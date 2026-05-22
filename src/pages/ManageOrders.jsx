import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Loader2, PackageCheck, Search, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import reserveService from '../services/reserveService';

const statusOptions = [
  { label: 'En supervision', value: 'SUPERVISION' },
  { label: 'Confirmadas', value: 'CONFIRMADA' },
  { label: 'Canceladas', value: 'CANCELADA' },
  { label: 'Todas', value: 'ALL' }
];

const statusStyle = {
  SUPERVISION: 'bg-amber-50 text-amber-700 border-amber-100',
  CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  CANCELADA: 'bg-red-50 text-red-700 border-red-100'
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  return data?.message || error?.message || fallback;
};

const ManageOrders = () => {
  const [status, setStatus] = useState('SUPERVISION');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = status === 'ALL'
        ? await reserveService.getAll(0, 100)
        : await reserveService.getByStatusAdmin(status, 0, 100);
      setOrders(response?.content || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(getErrorMessage(err, 'No se pudieron cargar los pedidos.'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === 'SUPERVISION').length,
    [orders]
  );

  const handleConfirm = async (reserveId) => {
    if (!window.confirm('Confirmar este pedido y descontar stock?')) return;

    try {
      setActionLoadingId(reserveId);
      await reserveService.confirmReserve(reserveId);
      await loadOrders();
    } catch (err) {
      console.error('Error confirming order:', err);
      alert(getErrorMessage(err, 'No se pudo confirmar el pedido.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (reserveId) => {
    const message = window.prompt('Motivo de cancelacion:', 'Pedido cancelado por administracion.');
    if (!message) return;

    try {
      setActionLoadingId(reserveId);
      await reserveService.cancelReserve(reserveId, message);
      await loadOrders();
    } catch (err) {
      console.error('Error canceling order:', err);
      alert(getErrorMessage(err, 'No se pudo cancelar el pedido.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
              Administracion
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mt-2">
              Gestionar Pedidos
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest border rounded-sm transition-colors ${
                  status === option.value
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <PackageCheck size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Mostrados</span>
            </div>
            <p className="text-3xl font-serif text-slate-900 mt-3">{orders.length}</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-amber-600">
              <Clock size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Pendientes</span>
            </div>
            <p className="text-3xl font-serif text-slate-900 mt-3">{pendingCount}</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <Search size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Filtro</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-4">{statusOptions.find((option) => option.value === status)?.label}</p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : error ? (
          <div className="bg-white border border-red-100 p-8 text-red-600 text-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-100 p-12 text-center shadow-sm">
            <PackageCheck className="mx-auto text-slate-200" size={56} />
            <h2 className="text-xl font-serif text-slate-900 mt-4">No hay pedidos para este filtro</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-100 shadow-sm">
                <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle[order.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {formatDate(order.creationDate)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {order.userName || 'Usuario sin nombre'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Codigo: {order.userCode || 'N/A'} | {order.userEmail || order.myUserId}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="bg-slate-50 border border-slate-100 px-4 py-3">
                          <div className="flex justify-between gap-4">
                            <span className="text-sm font-medium text-slate-800">{item.productName}</span>
                            <span className="text-sm font-bold text-slate-900">x{item.quantity}</span>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-slate-400">
                            <span>{formatCurrency(item.priceU)} c/u</span>
                            <span>{formatCurrency(item.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-64 flex lg:flex-col items-center lg:items-stretch justify-between gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                    <div className="lg:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                      <p className="text-2xl font-serif text-indigo-600">{formatCurrency(order.total)}</p>
                    </div>

                    {order.status === 'SUPERVISION' && (
                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => handleConfirm(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="px-4 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="px-4 py-3 bg-white border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageOrders;
