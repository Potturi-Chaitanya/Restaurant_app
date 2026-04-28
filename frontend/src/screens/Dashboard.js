import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const { setTable } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ Fetch tables safely
  useEffect(() => {
    fetch("http://localhost:5050/tables")
      .then((res) => res.json())
      .then((data) => {
        console.log("Tables API:", data);

        // ✅ Ensure array
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          setTables([]);
        }
      })
      .catch(() => setTables([]));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🍽️ Restaurant Tables</h1>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => {
          setTable("Parcel");
          navigate("/menu");
        }}
      >
        📦 Parcel Order
      </button>

      <div className="grid grid-cols-3 gap-4">
        {(Array.isArray(tables) ? tables : [])
          .filter((t) => t.is_active === 1)
          .map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setTable(t.table_number);
                navigate("/menu");
              }}
              className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
            >
              Table {t.table_number}
            </div>
          ))}
      </div>
    </div>
  );
}
