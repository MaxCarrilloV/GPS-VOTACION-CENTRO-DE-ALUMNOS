// src/routes/Root.jsx

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { logout } from "../services/auth.service";
import { AuthProvider, useAuth } from "../context/AuthContext";
import MainLayout from "../components/LandingPage";
import LayoutAdmin from "../layouts/Admin.jsx";
import toast, { Toaster } from "react-hot-toast";
import LayoutUser from '../layouts/User.jsx';
import LayoutTricel from "../layouts/Tricel.jsx";
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
  //console.log(user);

  return (
    <>
      {user ? (
        <>
          {user.roles[0].name === "admin" ? (
            <LayoutAdmin>
              <Outlet />
            </LayoutAdmin>
          ) : user.roles[0].name === "Miembro de Tricel" ? (
            <LayoutTricel>
              <Outlet />
            </LayoutTricel>
          ) : (
            <LayoutUser>
              <Outlet />
            </LayoutUser>
          )}
        </>
      ) : (
        <MainLayout />
      )}
    </>
  );
}

export default Root;
