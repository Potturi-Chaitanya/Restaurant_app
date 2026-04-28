import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, clearCart, table } = useContext(AppContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const checkout = async () => {
    try {
      const res = await fetch("http://localhost:5050/save-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          type: table === "Parcel" ? "parcel" : "dine",
          cart,
        }),
      });

      const data = await res.json();

      alert(`✅ Order Saved! Bill ID: ${data.billId}`);

      clearCart();
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Error saving order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Cart</h2>

      {cart.length === 0 && <p>No items added</p>}

      {cart.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 mb-3 rounded-xl shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">₹{item.price}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(item.id, "dec")}
              className="bg-red-500 text-white px-2 rounded"
            >
              -
            </button>
            <span className="font-bold">{item.qty}</span>
            <button
              onClick={() => updateQty(item.id, "inc")}
              className="bg-green-500 text-white px-2 rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <h3 className="text-lg font-bold">Total: ₹{total}</h3>

      <button
        onClick={checkout}
        className="bg-green-600 text-white w-full py-3 mt-4 rounded-xl"
      >
        Checkout
      </button>
    </div>
  );
}
