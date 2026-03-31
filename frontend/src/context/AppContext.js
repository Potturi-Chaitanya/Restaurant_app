import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [table, setTable] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, type) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        return {
          ...c,
          qty: type === "inc" ? c.qty + 1 : Math.max(1, c.qty - 1)
        };
      }
      return c;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      table, setTable,
      cart, addToCart, updateQty, clearCart
    }}>
      {children}
    </AppContext.Provider>
  );
};
