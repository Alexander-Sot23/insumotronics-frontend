import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import itemCartService from '../services/itemCartService';
import reserveService from '../services/reserveService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id || user?.userId;

  useEffect(() => {
    if (userId) {
      refreshCart();
    } else {
      setCart(null);
      setItems([]);
    }
  }, [userId]);

  const refreshCart = async () => {
    if (!(user?.id || user?.userId)) return;
    try {
      setLoading(true);
      const currentCart = await cartService.getOrCreateCurrentCart(user.id || user.userId);
      setCart(currentCart);

      if (currentCart && currentCart.id) {
        const itemsData = await itemCartService.getByCartId(currentCart.id, 0, 100);
        console.log('[CartContext] Raw items from API:', JSON.stringify(itemsData?.content?.[0], null, 2));
        if (itemsData && itemsData.content) {
          setItems(itemsData.content);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!(user?.id || user?.userId)) return { success: false, error: 'Usuario no autenticado. Datos: ' + JSON.stringify(user) };
    
    let currentCartId = cart?.id;
    
    try {
      if (!currentCartId) {
        const currentCart = await cartService.getOrCreateCurrentCart(user.id || user.userId);
        setCart(currentCart);
        currentCartId = currentCart?.id;
      }

      if (!currentCartId) return { success: false, error: 'No se pudo obtener el carrito activo' };

      // Verificar si el producto ya está en el carrito
      const existingItem = items.find(item => item.product?.id === productId);

      if (existingItem) {
        // Actualizar la cantidad en lugar de crear uno nuevo para evitar errores de restricción única
        await itemCartService.updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Usar create
        await itemCartService.create(currentCartId, productId, quantity);
      }
      
      await refreshCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error desconocido' 
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await itemCartService.updateQuantity(itemId, quantity);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await itemCartService.delete(itemId);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  };

  const checkoutCart = async () => {
    if (!cart?.id) return false;
    try {
      await reserveService.checkoutCart(cart.id);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error checking out:', error);
      return false;
    }
  };

  const safeItems = Array.isArray(items) ? items : [];
  const totalItems = safeItems.reduce((total, item) => total + (item?.quantity || 0), 0);
  const totalPrice = safeItems.reduce((total, item) => {
    // The API may return the price field as 'price' or 'unitPrice'
    const unitPrice = item?.product?.price ?? item?.product?.unitPrice ?? 0;
    return total + (unitPrice * (item?.quantity || 0));
  }, 0);

  const value = {
    cart,
    items,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    checkoutCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
