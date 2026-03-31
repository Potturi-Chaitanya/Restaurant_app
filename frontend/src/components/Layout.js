import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children, cart, table, clearCart }) {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/save-order", {
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

      alert("✅ Order Saved! Bill ID: " + data.billId);

      clearCart(); // clear cart after save
    } catch (err) {
      console.error(err);
      alert("❌ Error saving order");
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-white shadow p-4">
        <h1 className="text-xl font-bold mb-6">🍽️ RestroPOS</h1>

        <ul className="space-y-3">
          <li
            className="cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/dashboard")}
          >
            Tables
          </li>
          <li
            onClick={() => navigate("/admin")}
            className="cursor-pointer hover:text-blue-500"
          >
            Admin
          </li>
          <li
            className="cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/reports")}
          >
            Reports
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Order Preview</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>
                  {item.qty} x ₹{item.price}
                </span>
              </div>
            ))}

            <h3 className="font-bold mt-4">
              Total: ₹{cart.reduce((s, i) => s + i.price * i.qty, 0)}
            </h3>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCheckout();
                  setShowPreview(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Panel */}
      <div className="w-80 bg-white shadow p-4 flex flex-col justify-between">
        <div>
          <h2 className="font-bold mb-4">🧾 Order</h2>

          {cart.length === 0 && <p>No items</p>}

          {cart.map((item) => (
            <div key={item.id} className="mb-3 flex justify-between">
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} x {item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div>
          <h3 className="font-bold text-lg mb-2">
            Total: ₹{cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
          </h3>

          <button
            onClick={() => setShowPreview(true)}
            className="bg-green-600 text-white w-full py-2 rounded-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
