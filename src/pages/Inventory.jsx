import { useState, useEffect } from 'react';
import { Search, Filter, Package, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import inventoryService from '../services/inventoryService';
import ProductImage from '../components/ProductImage';

const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    // Implementación de debounce para la búsqueda
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [user, page, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data;
      
      if (searchTerm.trim()) {
        data = await inventoryService.searchByName(user?.role, searchTerm, page, 15);
      } else {
        data = await inventoryService.getAllProducts(user?.role, page, 15);
      }
      
      // Manejo de la respuesta Page de Spring o lista/objeto único
      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else if (data && typeof data === 'object') {
        // Si viene un objeto único (como tu findByName actual), lo metemos en un array
        setProducts([data]);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      // Evitamos mostrar error si es solo que no encontró un producto por nombre (404)
      if (err.response?.status === 404) {
        setProducts([]);
        setTotalPages(0);
      } else {
        setError('No se pudo cargar el inventario.');
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'GENERAL', 'RESISTENCIAS', 'CAPACITORES', 'INDUCTORES', 'DIODOS',
    'TRANSISTORES', 'CIRCUITOS_INTEGRADOS', 'MICROCONTROLADORES', 'SENSORES',
    'LEDS_Y_DISPLAYS', 'CONECTORES_Y_CABLES', 'FUENTES_DE_ALIMENTACION',
    'PROTOBOARD_Y_HERRAMIENTAS', 'BATERIAS_Y_CARGADORES', 'RELEVADORES_Y_ACTUADORES'
  ];

  const formatCategory = (cat) => {
    if (!cat || cat === 'ALL') return 'TODAS LAS CATEGORÍAS';
    return cat.replace(/_/g, ' ').toUpperCase();
  };

  // Aseguramos que displayedProducts siempre sea un array antes de filtrar
  const displayedProducts = Array.isArray(products) ? products.filter(product => {
    return selectedCategory === 'ALL' || product.category === selectedCategory;
  }) : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif text-slate-900">Inventario</h2>
            <p className="text-slate-400 text-xs font-light tracking-wide">Explora los componentes disponibles.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar componente..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 transition-all text-sm"
              />
            </div>

            {/* Filter */}
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 transition-all text-sm appearance-none cursor-pointer text-slate-600 uppercase"
              >
                <option value="ALL">Categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-red-50 p-10 rounded-sm text-center space-y-3">
            <AlertCircle className="mx-auto text-red-400" size={32} />
            <p className="text-slate-600 text-sm">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-5 py-2 bg-slate-900 text-white text-[10px] uppercase tracking-widest rounded-sm hover:bg-indigo-900 transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-slate-200 rounded-sm">
            <Package className="mx-auto text-slate-200 mb-4" size={40} />
            <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">No hay resultados</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-slate-50/80 group cursor-pointer border border-slate-200/60 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 rounded-sm overflow-hidden flex flex-col"
                >
                  {/* Product Image - Shorter height with padding to make image look smaller */}
                  <div className="aspect-[4/3] bg-white relative overflow-hidden flex items-center justify-center border-b border-slate-50 p-2">
                    <ProductImage 
                      fileName={product.pathImages?.[0]} 
                      alt={product.name} 
                    />
                    
                    {/* Stock Badge - Larger and more visible */}
                    <div className={`absolute top-2 right-2 px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full shadow-sm ${
                      product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {product.stock > 0 ? `${product.stock} DISPONIBLES` : 'AGOTADO'}
                    </div>
                  </div>

                  {/* Product Info - More prominent text */}
                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest block mb-1">
                        {formatCategory(product.category)}
                      </span>
                      <h3 className="text-slate-900 font-bold text-base group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <p className="text-lg text-slate-900 font-black tracking-tight">${product.price.toFixed(2)}</p>
                      <button className="text-[11px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  disabled={page === 0}
                  onClick={() => {
                    setPage(p => p - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Página</span>
                  <span className="text-xs font-bold text-slate-900">{page + 1}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">de</span>
                  <span className="text-xs font-bold text-slate-900">{totalPages}</span>
                </div>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => {
                    setPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Inventory;
