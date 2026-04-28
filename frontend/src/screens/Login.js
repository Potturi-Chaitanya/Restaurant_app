import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (role === "admin") {
      if (username === "admin" && password === "admin@123") {
        localStorage.setItem("admin", "true");
        navigate("/admin");
      } else {
        alert("Invalid admin credentials");
      }
    } else {
      localStorage.removeItem("admin");
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden">
      {/* 🔥 FULL PAGE BLUR LOGO (OUTSIDE CARD) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={logo}
          alt="bg-logo"
          className="absolute w-[3000px] opacity-70 blur-2xl
                   top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0"
        />
      </div>

      {/* 🔥 OPTIONAL GLOW (RECOMMENDED) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[900px] h-[900px] bg-yellow-300 opacity-20 blur-3xl rounded-full"></div>
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 flex w-4/5 max-w-5xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30">
        {/* LEFT */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center">
          <img src={logo} alt="logo" className="w-20 mb-4" />

          <h1 className="text-3xl font-bold mb-1">VIBGYOR ENTERPRISES</h1>

          <p className="text-gray-600 mb-6">
            Login as {role === "admin" ? "Admin" : "User"}
          </p>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-80 p-3 mb-3 rounded-lg border bg-white/70"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-80 p-3 mb-4 rounded-lg border bg-white/70"
          />

          <button
            onClick={handleLogin}
            className="w-80 py-3 rounded-lg bg-black text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm text-gray-700 underline"
          >
            Back to Home
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 hidden md:flex items-center justify-center p-6">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
            alt="food"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
