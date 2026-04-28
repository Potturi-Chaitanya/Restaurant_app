import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [tableCount, setTableCount] = useState("");
  const [tables, setTables] = useState([]);

  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);

  // ✅ Load Tables
  const loadTables = () => {
    fetch("http://localhost:5050/tables")
      .then((res) => res.json())
      .then((data) => setTables(data));
  };

  // ✅ Load Items
  const loadItems = () => {
    fetch("http://localhost:5050/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  useEffect(() => {
    loadTables();
    loadItems();
  }, []);

  // ✅ Create Tables (Smart Logic)
  const addTables = async () => {
    await fetch("http://localhost:5050/add-multiple-tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: tableCount }),
    });

    alert("Tables Updated");
    loadTables();
  };

  // ✅ Toggle Table
  const toggleTable = async (t) => {
    await fetch("http://localhost:5050/toggle-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: t.id,
        is_active: t.is_active === 1 ? 0 : 1,
      }),
    });

    loadTables();
  };

  // ✅ Add Item
  const addItem = async () => {
    await fetch("http://localhost:5050/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: item,
        price,
      }),
    });

    alert("Item Added");
    loadItems();
  };

  // ✅ Toggle Item
  const toggleItem = async (i) => {
    await fetch("http://localhost:5050/toggle-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: i.id,
        is_available: i.is_available === 1 ? 0 : 1,
      }),
    });

    loadItems();
  };

  return (
    <div className="p-6">
      {/* 🔥 NAVIGATION BAR */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          POS
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {/* ✅ Create Tables */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Create Tables</h2>

        <input
          placeholder="Number of Tables (e.g. 10)"
          value={tableCount}
          onChange={(e) => setTableCount(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addTables}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Update Tables
        </button>
      </div>

      {/* ✅ Manage Tables */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Manage Tables</h2>

        {tables.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>Table {t.table_number}</span>

            <button
              onClick={() => toggleTable(t)}
              className={`px-3 py-1 rounded text-white ${
                t.is_active === 1 ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {t.is_active === 1 ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Add Item */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Add Item</h2>

        <input
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addItem}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add Item
        </button>
      </div>

      {/* ✅ Manage Items */}
      <div>
        <h2 className="font-semibold mb-2">Manage Items</h2>

        {items.map((i) => (
          <div
            key={i.id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>
              {i.name} - ₹{i.price}
            </span>

            <button
              onClick={() => toggleItem(i)}
              className={`px-3 py-1 rounded text-white ${
                i.is_available === 1 ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {i.is_available === 1 ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
