import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";

  if (!isAdmin) {
    return <Navigate to="/login?role=admin" />;
  }

  return children;
}
