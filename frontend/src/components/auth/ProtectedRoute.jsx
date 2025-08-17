// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing, initializeAuth } = useAuthStore();
  const location = useLocation();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading spinner while initializing
  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
