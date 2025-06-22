import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet (CDN fallback)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Map = () => {
  const position = [-1.286389, 36.817223]; // Nairobi

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
      {/* Top Card with Map */}
      <Card
        sx={{
          height: 400,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ height: '100%', p: 0 }}>
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                You are here: Nairobi
              </Popup>
            </Marker>
          </MapContainer>
        </CardContent>
      </Card>

      {/* Bottom Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Track Your Order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This map shows the center of Nairobi. You can zoom, drag, and interact with it.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Map;
