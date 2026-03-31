import { useEffect, useState } from "react";

export default function Reports() {
  const [data, setData] = useState({
    summary: {},
    items: [],
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then(setData);
    console.log("REPORT DATA:", data);
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Reports Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold">
            {data.summary?.total_orders || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold">
            ₹{data.summary?.total_revenue || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Items Sold</h2>
          <p className="text-2xl font-bold">
            {(data.items || []).reduce((a, b) => a + (b.total_sold || 0), 0)}
          </p>
        </div>
      </div>
      {/* ITEMS TABLE */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Items Sold</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Item</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {(data.items || []).map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.item_name}</td>
                <td>{item.total_sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
