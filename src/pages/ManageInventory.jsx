import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Save, 
  Package, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import inventoryService from '../services/inventoryService';
import ProductImage from '../components/ProductImage';

const ManageInventory = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tabs: 'add' or 'list'
  const [activeTab, setActiveTab] = useState('add');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'GENERAL'
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  
  // Custom Toast for SweetAlert2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#0f172a',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  const categories = [
    'GENERAL', 'RESISTENCIAS', 'CAPACITORES', 'INDUCTORES', 'DIODOS',
    'TRANSISTORES', 'CIRCUITOS_INTEGRADOS', 'MICROCONTROLADORES', 'SENSORES',
    'LEDS_Y_DISPLAYS', 'CONECTORES_Y_CABLES', 'FUENTES_DE_ALIMENTACION',
    'PROTOBOARD_Y_HERRAMIENTAS', 'BATERIAS_Y_CARGADORES', 'RELEVADORES_Y_ACTUADORES'
  ];

  // Handle navigation from ProductDetails
  useEffect(() => {
    if (location.state?.editProduct) {
      handleEdit(location.state.editProduct);
      // Clear state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch products for list tab
  useEffect(() => {
    if (activeTab === 'list') {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [activeTab, searchTerm, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data;
      if (searchTerm.trim()) {
        data = await inventoryService.searchByName(user?.role, searchTerm, page, 10);
      } else {
        data = await inventoryService.getAllProducts(user?.role, page, 10);
      }

      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else if (data && typeof data === 'object') {
        setProducts([data]);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > MAX_SIZE) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      Swal.fire({
        title: 'Archivos muy grandes',
        text: `Los siguientes archivos superan el límite de 10MB: ${invalidFiles.join(', ')}`,
        icon: 'warning',
        confirmButtonColor: '#4f46e5'
      });
    }

    if (type === 'images') {
      setImages(prev => [...prev, ...validFiles]);
    } else {
      setDocuments(prev => [...prev, ...validFiles]);
    }
    
    e.target.value = '';
  };

  const removeFile = (index, type) => {
    if (type === 'images') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeExistingFile = (fileName, type) => {
    if (type === 'images') {
      setExistingImages(prev => prev.filter(name => name !== fileName));
    } else {
      setExistingDocuments(prev => prev.filter(name => name !== fileName));
    }
  };

  const getDisplayFileName = (urlOrPath) => {
    if (!urlOrPath) return '';
    const fileName = urlOrPath.split('/').pop();
    const parts = fileName.split('_');
    if (parts.length >= 3) {
      return parts.slice(2).join('_');
    }
    return fileName;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: 'GENERAL'
    });
    setImages([]);
    setDocuments([]);
    setExistingImages([]);
    setExistingDocuments([]);
    setEditingId(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrls: existingImages,
        documentUrls: existingDocuments
      };

      const handleProgress = (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      if (editingId) {
        await inventoryService.updateProduct(editingId, productData, images, documents, handleProgress);
        Toast.fire({
          icon: 'success',
          title: 'Producto actualizado correctamente'
        });
        setActiveTab('list');
      } else {
        await inventoryService.createProduct(productData, images, documents, handleProgress);
        Toast.fire({
          icon: 'success',
          title: 'Producto creado correctamente'
        });
        resetForm();
      }
    } catch (err) {
      console.error('Error saving product:', err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al guardar el producto. Verifica los campos.',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setExistingImages(product.imageUrls || []);
    setExistingDocuments(product.documentUrls || []);
    setImages([]);
    setDocuments([]);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y eliminará el componente permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red-500
      cancelButtonColor: '#94a3b8',  // slate-400
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await inventoryService.deleteProduct(id);
        fetchProducts();
        
        if (editingId === id) {
          resetForm();
        }

        Toast.fire({
          icon: 'success',
          title: 'Componente eliminado'
        });
      } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto.',
          icon: 'error',
          confirmButtonColor: '#4f46e5'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-4xl font-serif text-slate-900 tracking-tight">Gestionar Inventario</h2>
            <p className="text-slate-400 text-sm font-light">Administra el catálogo de componentes de la universidad.</p>
          </div>

          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            <button 
              onClick={() => {
                if (editingId) {
                  Swal.fire({
                    title: '¿Salir de la edición?',
                    text: 'Los cambios no guardados se perderán.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4f46e5',
                    cancelButtonColor: '#94a3b8',
                    confirmButtonText: 'Sí, salir',
                    cancelButtonText: 'Continuar editando'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      resetForm();
                      setActiveTab('add');
                    }
                  });
                } else {
                  setActiveTab('add');
                }
              }}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'add' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {editingId ? <Edit2 size={14} /> : <Plus size={14} />}
              {editingId ? 'Editar Componente' : 'Nuevo Componente'}
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              <Search size={14} />
              Listado y Búsqueda
            </button>
          </div>
        </div>

        {activeTab === 'add' ? (
          <div className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Basic Info */}
                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-indigo-50 pb-4">
                    Información Básica
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre del Componente</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej. Arduino Uno R3"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 focus:bg-white transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio ($)</label>
                        <input 
                          required
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 focus:bg-white transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Inicial</label>
                        <input 
                          required
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 focus:bg-white transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                      <select 
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Media & Files */}
                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-indigo-50 pb-4">
                    Media y Documentación
                  </h3>

                  <div className="space-y-8">
                    {/* Images Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={14} /> Imágenes
                        </label>
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                        >
                          Añadir
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileChange(e, 'images')}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      
                      <div className="grid grid-cols-4 gap-3">
                        {/* Existing Images */}
                        {existingImages.map((img, idx) => (
                          <div key={`existing-${idx}`} className="aspect-square relative group bg-slate-100 rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                            <ProductImage fileName={img} alt="preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => removeExistingFile(img, 'images')}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {/* New Images */}
                        {images.map((file, idx) => (
                          <div key={`new-${idx}`} className="aspect-square relative group bg-indigo-50 rounded-sm border border-indigo-100 overflow-hidden shadow-sm">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => removeFile(idx, 'images')}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="aspect-square border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-200 transition-all gap-1"
                        >
                          <Upload size={20} />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Subir</span>
                        </button>
                      </div>
                    </div>

                    {/* Documents Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={14} /> Fichas Técnicas (PDF)
                        </label>
                        <button 
                          type="button"
                          onClick={() => docInputRef.current.click()}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                        >
                          Añadir
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={docInputRef} 
                        onChange={(e) => handleFileChange(e, 'documents')}
                        accept=".pdf"
                        multiple
                        className="hidden"
                      />

                      <div className="space-y-2">
                        {/* Existing Docs */}
                        {existingDocuments.map((doc, idx) => (
                          <div key={`existing-doc-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-sm group">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-red-400" />
                              <span className="text-xs font-medium text-slate-600 truncate max-w-[200px]" title={getDisplayFileName(doc)}>
                                {getDisplayFileName(doc)}
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeExistingFile(doc, 'documents')}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        {/* New Docs */}
                        {documents.map((file, idx) => (
                          <div key={`new-doc-${idx}`} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-sm group animate-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-indigo-400" />
                              <span className="text-xs font-medium text-indigo-700 truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFile(idx, 'documents')}
                              className="text-indigo-300 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="lg:col-span-2 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow flex flex-col gap-2">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-indigo-600 disabled:bg-slate-300 transition-all shadow-xl relative overflow-hidden"
                    >
                      {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-indigo-600/30 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      )}
                      
                      <div className="relative z-10 flex items-center gap-3">
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            {uploadProgress > 0 && uploadProgress < 100 
                              ? `Subiendo... ${uploadProgress}%` 
                              : (uploadProgress === 100 ? 'Procesando...' : (editingId ? 'Actualizando...' : 'Publicando...'))}
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            {editingId ? 'Actualizar Componente' : 'Publicar Componente'}
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                  {editingId && (
                    <>
                      <button 
                        type="button"
                        onClick={() => handleDelete(editingId)}
                        className="px-8 py-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Eliminar
                      </button>
                      <button 
                        type="button"
                        onClick={resetForm}
                        className="px-8 py-4 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-slate-50 transition-all"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search and Filters for List */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar componente por nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-sm focus:outline-none focus:border-indigo-200 transition-all text-sm"
                />
              </div>
            </div>

            {/* Results Table/List */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                  <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">Buscando en el inventario...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-32 space-y-4">
                  <Package className="mx-auto text-slate-200" size={48} />
                  <p className="text-slate-400 font-light tracking-widest text-[10px] uppercase">No se encontraron componentes</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Precio</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white border border-slate-100 rounded-sm overflow-hidden flex-shrink-0">
                                <ProductImage fileName={product.imageUrls?.[0]} alt={product.name} />
                              </div>
                              <span className="font-bold text-slate-900 text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-sm uppercase">
                              {product.category?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-black text-slate-900">${product.price.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                              <span className="font-medium text-slate-700 text-sm">{product.stock}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(product)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-slate-200 rounded-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-slate-200 rounded-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-slate-300 text-[10px] font-medium uppercase tracking-[0.3em]">
          Insumotronics Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default ManageInventory;
