import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import useAuthStore from "./store/authStore";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/website/LandingPage";
import AboutPage from "./pages/website/AboutPage";
import FeaturesPage from "./pages/website/FeaturesPage";
import LoginPage from "./pages/website/LoginPage";
import SignUpPage from "./pages/website/SignUpPage";
import ResetPasswordPage from "./pages/website/ResetPasswordPage";
import NewPasswordPage from "./pages/website/NewPasswordPage";
import SignupVerifyEmailPage from "./pages/website/SignupVerifyEmailPage";
import ResetPasswordConfirmPage from "./pages/website/ResetPwConfirm";

import Dashboard from "./pages/webApp/Dashboard";
import Projects from "./pages/webApp/Projects";
import ProjectDetails from "./pages/webApp/ProjectDetails";
import Search from "./pages/webApp/Search";
import Profile from "./pages/webApp/Profile";
import Chats from "./pages/webApp/Chats";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/signup/verify-email"
            element={<SignupVerifyEmailPage />}
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route
            path="/reset-password/confirm"
            element={<ResetPasswordConfirmPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Projects />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id/details"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProjectDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Chats />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Search />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          enableMultiContainer={false}
          containerId="default"
        />
      </div>
    </Router>
  );
}

export default App;
