import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Package, 
  ShoppingCart, 
  ChevronRight,
  Info,
  Download,
  Pencil,
  Plus,
  Minus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import inventoryService from '../services/inventoryService';
import ProductImage from '../components/ProductImage';
import apiClient from '../api/client';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getProductById(user?.role, id);
        setProduct(data);
        setSelectedQuantity(1);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('No se pudo cargar la información del producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    
    setActionLoading(true);
    const result = await addToCart(product.id, selectedQuantity);
    if (result && result.success) {
      alert(`${selectedQuantity} pieza(s) agregada(s) al carrito.`);
    } else {
      const errorMsg = result?.error || 'Hubo un error al agregar el producto al carrito.';
      alert(`Error: ${errorMsg}`);
    }
    setActionLoading(false);
  };

  const updateSelectedQuantity = (change) => {
    setSelectedQuantity((current) => {
      const nextQuantity = current + change;
      if (!product?.stock) return 1;
      return Math.min(Math.max(nextQuantity, 1), product.stock);
    });
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await apiClient.get(`/api/student/files/download-file`, {
        params: { fileName },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Intentar obtener el nombre del archivo del header content-disposition si es posible
      const contentDisposition = response.headers['content-disposition'];
      let downloadName = fileName;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch?.[1]) downloadName = fileNameMatch[1];
      } else {
        // Fallback: extraer el nombre desde la URL porque CORS bloquea content-disposition
        const lastSlashIndex = fileName.lastIndexOf('/');
        const nameWithPrefix = lastSlashIndex !== -1 ? fileName.substring(lastSlashIndex + 1) : fileName;
        
        // Quitar el prefijo de timestamp_uid_ que agrega Supabase
        const parts = nameWithPrefix.split('_');
        if (parts.length >= 3) {
          downloadName = parts.slice(2).join('_');
        } else {
          downloadName = nameWithPrefix;
        }
      }

      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const formatCategory = (cat) => {
    if (!cat) return 'GENERAL';
    return cat.replace(/_/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white p-12 text-center space-y-6 rounded-sm border border-slate-100 shadow-sm">
            <Package className="mx-auto text-slate-200" size={64} />
            <h2 className="text-2xl font-serif text-slate-900">{error || 'Producto no encontrado'}</h2>
            <button 
              onClick={() => navigate('/inventory')}
              className="px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-indigo-900 transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Volver al Inventario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
          <button onClick={() => navigate('/home')} className="hover:text-indigo-600 transition-colors">Inicio</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('/inventory')} className="hover:text-indigo-600 transition-colors">Inventario</button>
          <ChevronRight size={12} />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="bg-slate-50/80 rounded-sm border border-slate-200/60 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side: Image Gallery */}
            <div className="p-8 lg:p-12 bg-slate-50/80 flex flex-col gap-6">
              <div className="aspect-square bg-white border border-slate-50 rounded-sm overflow-hidden relative group">
                <ProductImage 
                  fileName={product.imageUrls?.[activeImage]} 
                  alt={product.name} 
                />
                <div className={`absolute top-4 right-4 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${
                  product.stock > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {product.stock > 0 ? `${product.stock} DISPONIBLES` : 'SIN STOCK'}
                </div>
              </div>

              {/* Thumbnails */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.imageUrls.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square border-2 rounded-sm overflow-hidden bg-white transition-all ${
                        activeImage === idx ? 'border-indigo-600 shadow-md' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <ProductImage fileName={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Product Details */}
            <div className="p-8 lg:p-12 lg:border-l border-slate-200/60 bg-slate-50/80 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm mb-4">
                    {formatCategory(product.category)}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-serif text-slate-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-3xl font-black text-slate-900 mt-6 tracking-tight">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-sm border border-slate-100 shadow-sm">
                    <Info className="text-indigo-500 shrink-0" size={20} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Este componente se encuentra actualmente {product.stock > 0 ? 'disponible para reserva inmediata' : 'agotado'}. 
                        Consulta con administración para tiempos de reabastecimiento.
                      </p>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {product.documentUrls && product.documentUrls.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documentación Técnica</p>
                      <div className="grid grid-cols-1 gap-2">
                        {product.documentUrls.map((doc, idx) => (
                          <button 
                            key={idx}
                            onClick={() => handleDownload(doc)}
                            className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 hover:border-indigo-100 transition-all group text-left shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="text-red-400" size={20} />
                              <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]" title={doc.split('/').pop().split('_').length >= 3 ? doc.split('/').pop().split('_').slice(2).join('_') : doc.split('/').pop()}>
                                {doc.split('/').pop().split('_').length >= 3 ? doc.split('/').pop().split('_').slice(2).join('_') : doc.split('/').pop()}
                              </span>
                            </div>
                            <Download size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center border border-slate-200 bg-white rounded-sm w-fit">
                    <button
                      type="button"
                      onClick={() => updateSelectedQuantity(-1)}
                      disabled={selectedQuantity <= 1 || actionLoading || product.stock <= 0}
                      className="p-3 text-slate-500 hover:text-indigo-600 disabled:opacity-40 transition-colors"
                      title="Restar pieza"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-14 text-center text-sm font-bold text-slate-900">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateSelectedQuantity(1)}
                      disabled={selectedQuantity >= product.stock || actionLoading || product.stock <= 0}
                      className="p-3 text-slate-500 hover:text-indigo-600 disabled:opacity-40 transition-colors"
                      title="Agregar pieza"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Piezas a reservar
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-grow flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg ${
                    product.stock > 0 
                    ? 'bg-slate-900 text-white hover:bg-indigo-600' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock <= 0 || actionLoading}
                >
                  <ShoppingCart size={18} /> {actionLoading ? 'Agregando...' : 'Reservar Ahora'}
                </button>
                <button 
                  onClick={() => navigate('/inventory')}
                  className="px-8 py-4 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-slate-50 transition-all"
                >
                  Regresar
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => navigate('/manage-inventory', { state: { editProduct: product } })}
                    className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                    title="Editar Producto"
                  >
                    <Pencil size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Editar</span>
                  </button>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
