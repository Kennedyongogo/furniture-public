import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  LayersControl,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import RoutingControl from './RoutingControl'; // ✅ updated one

// Fix marker icon path issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Styled Shop Icon
const shopIcon = L.divIcon({
  html: `<div style="font-size: 24px; color: blue; line-height: 1;">🛒</div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// 🧭 Legend Component
const LegendControl = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.background = 'white';
      div.style.padding = '6px 10px';
      div.style.borderRadius = '4px';
      div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
      div.style.fontSize = '14px';
      div.innerHTML = `
        <strong>Legend</strong><br />
        🛒 Shop<br />
        🎯 Destination<br />
        🛵 Rider
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

// 🚦 Direction Icons Mapping
const getDirectionIcon = (instruction) => {
  const lower = instruction.toLowerCase();
  if (lower.includes('left')) return '⬅️';
  if (lower.includes('right')) return '➡️';
  if (lower.includes('roundabout')) return '🔁';
  if (lower.includes('continue')) return '⬆️';
  if (lower.includes('head')) return '🧭';
  if (lower.includes('ramp')) return '↗️';
  if (lower.includes('merge')) return '🔀';
  return '➡️';
};

// 📍 Main Map Component
const Map = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const shopPosition = [-1.286389, 36.817223]; // Nairobi center

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3003/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      {/* Map Card */}
      <Card sx={{ height: 400, borderRadius: 3, overflow: 'hidden', boxShadow: 4 }}>
        <CardContent sx={{ height: '100%', p: 0 }}>
          <MapContainer
            center={shopPosition}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <LayersControl position="bottomleft">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Satellite View (Esri)">
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {/* 🛒 Shop Marker */}
            <Marker position={shopPosition} icon={shopIcon}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                Shop
              </Tooltip>
              <Popup>🛒 Shop Location</Popup>
            </Marker>

            {/* 🎯 Orders */}
            {orders.map((order) => {
              const lat = parseFloat(order.latitude);
              const lng = parseFloat(order.longitude);
              if (isNaN(lat) || isNaN(lng)) return null;

              return (
                <Marker
                  key={order.id}
                  position={[lat, lng]}
                  eventHandlers={{
                    click: () => {
                      if (selectedOrder?.id !== order.id) {
                        setSelectedOrder(order);
                        setRouteData(null);
                      }
                    },
                    
                    popupclose: () => {
                      // ✅ Add slight delay to prevent route flicker
                      setTimeout(() => {
                        setSelectedOrder(null);
                        setRouteData(null);
                      }, 300);
                    }
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    🎯 Destination
                  </Tooltip>
                  <Popup>
                    <div style={{
                      minWidth: '200px',
                      padding: '10px',
                      backgroundColor: '#fefefe',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#333',
                      lineHeight: '1.6'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        📦 Order #{order.order_number}
                      </div>
                      <div><strong>Status:</strong> {order.order_status}</div>
                      <div><strong>Total Price:</strong> KES {parseFloat(order.total_price).toFixed(2)}</div>
                      <div><strong>Items:</strong> {order.OrderItems?.length || 0}</div>
                      <hr style={{ margin: '8px 0' }} />
                      <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#777' }}>
                        Delivered to coordinates:<br />
                        <code>{order.latitude}, {order.longitude}</code>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 🛣️ Routing only when marker is clicked */}
            <RoutingControl
              from={shopPosition}
              to={selectedOrder ? [
                parseFloat(selectedOrder.latitude),
                parseFloat(selectedOrder.longitude),
              ] : null}
              setRouteData={setRouteData}
            />

            <LegendControl />
          </MapContainer>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Track Your Order
          </Typography>

          {selectedOrder && routeData ? (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Order #{selectedOrder.order_number}</strong><br />
                <strong>Status:</strong> {selectedOrder.order_status}<br />
                <strong>Total Price:</strong> KES {parseFloat(selectedOrder.total_price).toFixed(2)}<br />
                <strong>Distance:</strong> {routeData.distance}<br />
                <strong>Time:</strong> {routeData.time}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Directions:
              </Typography>
              <ol style={{
                fontSize: '13px',
                color: '#555',
                paddingLeft: '20px',
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '10px',
              }}>
                {routeData.steps.map((step, index) => (
                  <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <span>{getDirectionIcon(step.text)}</span>
                    <span style={{ flexGrow: 1 }}>{step.text}</span>
                    <span style={{ color: '#999' }}>{step.distance}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Click on any destination marker to view the delivery route from the shop.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Map;
