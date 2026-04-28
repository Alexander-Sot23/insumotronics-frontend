import Navbar from '../components/Navbar';

const ManageOrders = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-serif text-slate-900">Gestionar Pedidos</h2>
          <p className="text-slate-400 font-light text-lg">
            Bienvenido a la ventana de Gestión de Pedidos.<br />
            <span className="text-indigo-600 font-medium uppercase tracking-[0.2em] text-sm">Próximamente...</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ManageOrders;
