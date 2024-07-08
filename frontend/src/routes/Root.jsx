// src/routes/Root.jsx

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { logout } from "../services/auth.service";
import { AuthProvider, useAuth } from "../context/AuthContext";
import MainLayout from "../components/LandingPage";
import LayoutAdmin from "../layouts/admin.jsx";
import toast, { Toaster } from "react-hot-toast";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const { user } = useAuth();

  return (
    <>
      {user ? (
        <LayoutAdmin>
          <Outlet />
        </LayoutAdmin>
      ) : (
        <MainLayout />
      )}
    </>
  );
}

export default Root;
