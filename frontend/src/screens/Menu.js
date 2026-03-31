import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
// import biryaniImg from "../assets/Biryani.jpg";
// import friedRiceImg from "../assets/Burger.jpg";
// import chickenImg from "../assets/Pizza.jpg";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Menu() {
  const { addToCart, cart, updateQty, table, clearCart } =
    useContext(AppContext);

  // ✅ Hooks MUST be inside component
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://your-backend.onrender.com/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.qty : 0;
  };

  return (
    <Layout cart={cart} table={table} clearCart={clearCart}>
      <h2 className="text-xl font-bold mb-4">Table: {table}</h2>

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => {
          const qty = getQty(item.id);

          return (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow">
              <h3 className="font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>

              {item.stock === 0 ? (
                <button className="bg-gray-400 text-white px-3 py-1 mt-2 rounded">
                  Out of Stock
                </button>
              ) : qty === 0 ? (
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                >
                  Add
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="bg-red-500 text-white px-2"
                  >
                    -
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="bg-green-500 text-white px-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
