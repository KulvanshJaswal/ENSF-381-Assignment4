import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./pages/Homepage";
import FlavorsPage from "./pages/FlavorsPage";
import LoginPage from "./pages/LoginPage";

import SignupPage from "./pages/SignUpPage";
import OrderHistory from "./pages/orderHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/flavors" element={localStorage.getItem("userId") ? <FlavorsPage /> : <Navigate to="/login" />} />
<Route path="/orderHistory" element={localStorage.getItem("userId") ? <OrderHistory /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;