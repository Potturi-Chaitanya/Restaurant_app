import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Restaurant POS</h1>

      <button
        onClick={() => navigate("/login?role=admin")}
        className="bg-blue-600 text-white px-6 py-3 rounded mb-4"
      >
        Admin Login
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("admin"); // ✅ REMOVE ADMIN ACCESS
          navigate("/dashboard");
        }}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        User (POS)
      </button>
    </div>
  );
}
