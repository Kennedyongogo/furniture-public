// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import WatercolorLayout from './components/WatercolorLayout';
import Home from './components/Home';
import Furniture from './components/Furniture';
import Map from './components/Map';
import Notification from './components/Notification';
import Cart from './components/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Run on initial load to set login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // This function is passed to login component to update state after login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <WatercolorLayout onLoginSuccess={handleLoginSuccess} />
        }
      >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route
          path="furniture"
          element={<Furniture isLoggedIn={isLoggedIn} />}
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="track-order"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
