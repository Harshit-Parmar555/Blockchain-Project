import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages Import
const HomePage = React.lazy(() => import("./pages/Home"));
const LandPage = React.lazy(() => import("./pages/Land"));
const RegisterPage = React.lazy(() => import("./pages/Register"));
const LoginPage = React.lazy(() => import("./pages/Login"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LandPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
