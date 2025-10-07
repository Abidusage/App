import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchResults from "./components/SearchResults";

import LoginForm from "./pages/LoginForm/LoginForm";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound/NotFound";
import FreeDev from "./pages/FreeDev/FreeDev";
import AboutUs from "./pages/AboutUs/AboutUs";
import FreeResources from "./pages/FreeResources/FreeResources";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact/Contact";
import EditResource from "./pages/EditResource/EditResource";
import ProfileDetail from "./pages/ProfileDetail/ProfileDetail";
import UserProfileForm from "./pages/UserProfileForm/UserProfileForm";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterForm route="/api/register/" />;
}

function App() {
  const [searchResults, setSearchResults] = useState(null);

  return (
    <BrowserRouter>
      <Navbar onSearch={setSearchResults} />
      <SearchResults results={searchResults} />

      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-resource/:id"
          element={
            <ProtectedRoute>
              <EditResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile/:id"
          element={
            <ProtectedRoute>
              <UserProfileForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfileForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<FreeDev />} />
        <Route path="/freedev" element={<FreeDev />} />
        <Route path="/freeresources" element={<FreeResources />} />
        <Route path="/login" element={<LoginForm route="/api/token/" />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/:id" element={<ProfileDetail />} />
        <Route
          path="/register"
          element={<RegisterForm route="/api/register/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
