// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WatercolorLayout from './components/WatercolorLayout';
import Home from './components/Home';
import Furniture from './components/Furniture';
import Map from './components/Map'; // ✅ Map (Track Order)
import Notification from './components/Notification'; // ✅ Notification component
import Cart from './components/Cart'; // ✅ Cart component
import 'leaflet/dist/leaflet.css'; // ✅ Leaflet CSS

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WatercolorLayout />}>
        {/* These are nested inside the layout */}
        <Route path="home" element={<Home />} />
        <Route path="furniture" element={<Furniture />} />
        <Route path="track-order" element={<Map />} /> {/* ✅ map route added */}
        <Route path="cart" element={<Cart />} /> {/* ✅ cart route */}
        <Route path="notifications" element={<Notification />} /> {/* ✅ notifications route */}
        <Route index element={<Home />} /> {/* default for "/" */}
      </Route>
    </Routes>
  );
};

export default App;
