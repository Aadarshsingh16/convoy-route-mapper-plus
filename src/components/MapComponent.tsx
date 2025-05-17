
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "sonner";

interface MapComponentProps {
  source?: string;
  destination?: string;
  halt?: string;
  selectedVehicleType: 'civil' | 'army';
}

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

const demoCoordinates = {
  newDelhi: [77.1025, 28.7041],
  bhopal: [77.4126, 23.2599],
  chennai: [80.2707, 13.0827]
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  source = "New Delhi, IN", 
  destination = "Chennai, IN", 
  halt = "Bhopal, IN",
  selectedVehicleType
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeLoaded, setRouteLoaded] = useState(false);

  useEffect(() => {
    if (mapContainer.current === null) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [79.5, 22.5], // Center of India
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Add route when map loads
    map.current.on('load', () => {
      if (!map.current) return;

      // Add markers for source, halt, and destination
      new mapboxgl.Marker({ color: '#4CAF50' })
        .setLngLat(demoCoordinates.newDelhi)
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#2196F3' })
        .setLngLat(demoCoordinates.bhopal)
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#F44336' })
        .setLngLat(demoCoordinates.chennai)
        .addTo(map.current);

      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              demoCoordinates.newDelhi,
              demoCoordinates.bhopal,
              demoCoordinates.chennai
            ]
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#1EAEDB',
          'line-width': 4
        }
      });

      // Add alternate route with dashed line
      map.current.addSource('alternate-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              demoCoordinates.newDelhi,
              [78.8, 22.8], // Slightly different path
              demoCoordinates.chennai
            ]
          }
        }
      });

      map.current.addLayer({
        id: 'alternate-route',
        type: 'line',
        source: 'alternate-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#808080',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });

      setRouteLoaded(true);
      toast.success("Route loaded successfully");
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update routes when vehicle type changes
  useEffect(() => {
    if (!map.current || !routeLoaded) return;

    if (selectedVehicleType === 'army') {
      map.current.setPaintProperty('route', 'line-color', '#FF9800');
    } else {
      map.current.setPaintProperty('route', 'line-color', '#1EAEDB');
    }

  }, [selectedVehicleType, routeLoaded]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default MapComponent;
