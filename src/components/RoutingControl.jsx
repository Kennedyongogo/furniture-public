import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Optional: Patch _clearLines to prevent ghost lines
if (L.Routing && L.Routing.Control) {
  const originalClearLines = L.Routing.Control.prototype._clearLines;

  L.Routing.Control.prototype._clearLines = function () {
    if (!this._lines) return;
    for (let line of this._lines) {
      if (line && this._map?.hasLayer(line)) {
        try {
          this._map.removeLayer(line);
        } catch (err) {
          console.warn('Safe line removal failed:', err.message);
        }
      }
    }
    this._lines = [];
  };
}

const RoutingControl = ({ from, to, setRouteData }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!from || !map) return;

    // Cleanup previous control
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (err) {
        console.warn('Failed to remove old routing control:', err.message);
      }
      routingControlRef.current = null;
    }

    // If 'to' is not set, do not add a new route
    if (!to) {
      setRouteData(null);
      return;
    }

    const timeout = setTimeout(() => {
      const control = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        lineOptions: {
          styles: [{ color: 'black', weight: 4 }],
        },
        addWaypoints: false,
        draggableWaypoints: false,
        routeWhileDragging: false,
        createMarker: () => null,
        show: false,
      }).addTo(map);

      control.on('routesfound', (e) => {
        const route = e.routes[0];
        const summary = route.summary;

        const instructions = route.instructions.map((inst) => ({
          text: inst.text,
          distance:
            inst.distance / 1000 < 1
              ? `${Math.round(inst.distance)} m`
              : `${(inst.distance / 1000).toFixed(1)} km`,
          icon: inst.type,
        }));

        setRouteData({
          distance: (summary.totalDistance / 1000).toFixed(1) + ' km',
          time: Math.round(summary.totalTime / 60) + ' min',
          steps: instructions,
        });
      });

      routingControlRef.current = control;
    }, 300); // ⏳ Delay helps prevent flicker

    return () => {
      clearTimeout(timeout);
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (err) {
          console.warn('Error during route cleanup:', err.message);
        }
        routingControlRef.current = null;
      }
    };
  }, [from, to, map, setRouteData]);

  return null;
};

export default RoutingControl;
