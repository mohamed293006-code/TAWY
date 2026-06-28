import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCart, saveCart } from "../services/cartService.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

function toServiceItems(items) {
  return items.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  }));
}

function fromServiceItems(items) {
  return items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const hasSyncedRef = useRef(false);

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("tawy_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Cart load error:", error);
      return [];
    }
  });

  const [isCartLoading, setIsCartLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("tawy_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart save error:", error);
    }
  }, [cart]);

  useEffect(() => {
    if (!user) {
      hasSyncedRef.current = false;
      setIsCartLoading(false);
      return;
    }

    hasSyncedRef.current = false;
    setIsCartLoading(true);

    async function syncWithCloud() {
      try {
        const cloudItems = await getCart(user.uid);

        if (cloudItems.length > 0) {
          setCart(fromServiceItems(cloudItems));
        } else {
          setCart((currentLocalCart) => {
            if (currentLocalCart.length > 0) {
              saveCart(user.uid, toServiceItems(currentLocalCart)).catch(
                (error) => console.error("Cart migrate error:", error)
              );
            }
            return currentLocalCart;
          });
        }
      } catch (error) {
        console.error("Cart sync error:", error);
      } finally {
        hasSyncedRef.current = true;
        setIsCartLoading(false);
      }
    }

    syncWithCloud();
  }, [user]);

  function persistToCloud(updatedCart) {
    if (!user) return;
    if (!hasSyncedRef.current) return;
    saveCart(user.uid, toServiceItems(updatedCart)).catch((error) =>
      console.error("Cart persist error:", error)
    );
  }

  function addToCart(product) {
    if (isCartLoading) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];

      persistToCloud(updatedCart);
      return updatedCart;
    });
  }

  function removeFromCart(productId) {
    if (isCartLoading) return;

    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      persistToCloud(updatedCart);
      return updatedCart;
    });
  }

  function updateQuantity(productId, quantity) {
    if (isCartLoading) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      persistToCloud(updatedCart);
      return updatedCart;
    });
  }

  function clearCart() {
    if (isCartLoading) return;

    setCart([]);
    if (user) {
      saveCart(user.uid, []).catch((error) =>
        console.error("Cart clear sync error:", error)
      );
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}