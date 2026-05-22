import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, items, loading, updateQuantity, removeItem, checkoutCart, totalItems, totalPrice } = useCart();
  const [actionLoading, setActionLoading] = useState(false);

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setActionLoading(true);
    await updateQuantity(itemId, newQuantity);
    setActionLoading(false);
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto de tu carrito?')) return;
    
    setActionLoading(true);
    await removeItem(itemId);
    setActionLoading(false);
  };

  const handleCheckout = async () => {
    if (!cart?.id || items.length === 0) return;
    
    if (!window.confirm('¿Deseas confirmar la reserva de estos productos?')) return;

    setActionLoading(true);
    const success = await checkoutCart();
    setActionLoading(false);

    if (success) {
      alert('¡Reserva confirmada con éxito!');
      navigate('/home');
    } else {
      alert('Hubo un error al procesar tu reserva. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header section */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => navigate('/inventory')}
            className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full border border-slate-200 shadow-sm transition-all"
            title="Volver al catálogo"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-4xl font-serif text-indigo-900 leading-tight tracking-wide">
            MI CARRITO
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-sm p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-serif text-slate-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-slate-400 max-w-md mb-8">
              Aún no has seleccionado ningún producto. Explora nuestro inventario y añade los materiales que necesitas para tus proyectos.
            </p>
            <button 
              onClick={() => navigate('/inventory')}
              className="px-8 py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Explorar Inventario
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Products List (Left Side) */}
            <div className="flex-1 space-y-4">
              <div className="mb-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  Total de productos seleccionados: <span className="text-indigo-600">{totalItems}</span>
                </span>
              </div>

              {items.filter(item => item != null).map((item) => (
                <div key={item.id} className="bg-white border border-slate-100 p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-100 transition-colors">
                  
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 p-2">
                    {(() => {
                      // Handle both 'images' (with path) and 'imageUrls' (string array) from different API responses
                      const imgPath = item.product?.imageUrls?.[0] || item.product?.images?.[0]?.path;
                      return imgPath ? (
                        <img 
                          src={`http://localhost:8080${imgPath}`} 
                          alt={item.product?.name} 
                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                        />
                      ) : (
                        <ShoppingCart className="text-slate-300" size={32} />
                      );
                    })()}
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex-1 flex flex-col md:flex-row justify-between w-full md:w-auto gap-4">
                    
                    {/* Name & Quantity */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-slate-800 line-clamp-2 leading-tight">
                        {item.product?.name ?? item.productName ?? 'Producto sin nombre'}
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-slate-200 bg-slate-50 rounded-sm">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            disabled={item.quantity <= 1 || actionLoading}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-50 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-slate-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            disabled={actionLoading || item.quantity >= (item.product?.stock ?? Infinity)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {item.product?.stock != null && item.quantity >= item.product.stock && (
                          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider">Stock máximo</span>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Subtotal</span>
                        <span className="text-2xl font-serif text-indigo-600 font-medium">
                          ${((item.product?.price ?? item.product?.unitPrice ?? 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={actionLoading}
                        className="mt-0 md:mt-4 text-slate-400 hover:text-red-500 transition-colors p-2 md:p-0 flex items-center gap-2 group-hover:opacity-100 opacity-70"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                        <span className="text-xs font-medium md:hidden">Eliminar</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (Right Side) */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white border border-slate-100 p-8 shadow-sm sticky top-32">
                <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                  Resumen de Reserva
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Costos adicionales</span>
                    <span>$0.00</span>
                  </div>
                  <div className="h-px bg-slate-100 w-full my-4"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Total Estimado</span>
                    <span className="text-3xl font-serif text-indigo-600 font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={actionLoading}
                  className="w-full py-4 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader className="animate-spin" size={16} /> : null}
                  Confirmar Reserva
                </button>
                
                <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">
                  Al confirmar tu reserva, el material quedará apartado y podrás recogerlo en el almacén de laboratorio.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
