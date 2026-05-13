import { useState, useEffect } from 'react';
import { Package, Loader2 } from 'lucide-react';
import apiClient from '../api/client';

const ProductImage = ({ fileName, alt }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!fileName) {
      setLoading(false);
      return;
    }

    let objectUrl = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/student/files/view-file`, {
          params: { fileName }
        });

        setImageUrl(response.data);
        setError(false);
      } catch (err) {
        console.error('Error cargando imagen mediante API:', fileName, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-200 w-full h-full">
        <Package size={48} />
        <span className="text-[10px] mt-2 font-light uppercase tracking-widest">Sin imagen</span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className="w-full h-full object-contain" 
    />
  );
};

export default ProductImage;
