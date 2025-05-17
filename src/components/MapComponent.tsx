
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "sonner";

interface MapComponentProps {
  source?: string;
  destination?: string;
  halt?: string;
  selectedVehicleType: 'civil' | 'army';
  onLocationUpdate?: (type: 'source' | 'destination' | 'halt', location: string, coordinates: [number, number]) => void;
}

// Using the provided Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidXR0a2Fyc2gxNCIsImEiOiJjbWFpODAzbG0wNGUxMmlzaTlpYWgybTVuIn0.LweKduVrNZ0Bmo3D5nBjAw';

// Update the coordinate type to be properly typed as [number, number] tuples
const demoCoordinates: Record<string, [number, number]> = {
  newDelhi: [77.1025, 28.7041],
  bhopal: [77.4126, 23.2599],
  chennai: [80.2707, 13.0827]
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  source = "New Delhi, IN", 
  destination = "Chennai, IN", 
  halt = "Bhopal, IN",
  selectedVehicleType,
  onLocationUpdate
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeLoaded, setRouteLoaded] = useState(false);
  
  // Current coordinates being used
  const [sourceCoords, setSourceCoords] = useState<[number, number]>(demoCoordinates.newDelhi);
  const [destCoords, setDestCoords] = useState<[number, number]>(demoCoordinates.chennai);
  const [haltCoords, setHaltCoords] = useState<[number, number]>(demoCoordinates.bhopal);
  
  // Markers
  const sourceMarker = useRef<mapboxgl.Marker | null>(null);
  const destMarker = useRef<mapboxgl.Marker | null>(null);
  const haltMarker = useRef<mapboxgl.Marker | null>(null);

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
      sourceMarker.current = new mapboxgl.Marker({ color: '#4CAF50' }) // Green for source
        .setLngLat(sourceCoords)
        .addTo(map.current);

      haltMarker.current = new mapboxgl.Marker({ color: '#2196F3' }) // Blue for halt
        .setLngLat(haltCoords)
        .addTo(map.current);

      destMarker.current = new mapboxgl.Marker({ color: '#F44336' }) // Red for destination
        .setLngLat(destCoords)
        .addTo(map.current);

      // Allow markers to be draggable
      sourceMarker.current.setDraggable(true);
      haltMarker.current.setDraggable(true);
      destMarker.current.setDraggable(true);
      
      // Add drag end events
      sourceMarker.current.on('dragend', () => {
        if (!sourceMarker.current) return;
        const newCoords = sourceMarker.current.getLngLat();
        setSourceCoords([newCoords.lng, newCoords.lat]);
        updateRoutes();
        if (onLocationUpdate) {
          onLocationUpdate('source', `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`, [newCoords.lng, newCoords.lat]);
        }
      });
      
      haltMarker.current.on('dragend', () => {
        if (!haltMarker.current) return;
        const newCoords = haltMarker.current.getLngLat();
        setHaltCoords([newCoords.lng, newCoords.lat]);
        updateRoutes();
        if (onLocationUpdate) {
          onLocationUpdate('halt', `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`, [newCoords.lng, newCoords.lat]);
        }
      });
      
      destMarker.current.on('dragend', () => {
        if (!destMarker.current) return;
        const newCoords = destMarker.current.getLngLat();
        setDestCoords([newCoords.lng, newCoords.lat]);
        updateRoutes();
        if (onLocationUpdate) {
          onLocationUpdate('destination', `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`, [newCoords.lng, newCoords.lat]);
        }
      });

      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              sourceCoords,
              haltCoords,
              destCoords
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
              sourceCoords,
              [78.8, 22.8] as [number, number], // Type assertion for alternate point
              destCoords
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

    // Add click event to the map to add new locations
    map.current.on('click', (e) => {
      console.log(`Clicked at: [${e.lngLat.lng}, ${e.lngLat.lat}]`);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Function to update routes on the map
  const updateRoutes = () => {
    if (!map.current || !routeLoaded) return;
    
    // Update main route - Fix type casting for GeoJSON source
    const mainRouteSource = map.current.getSource('route');
    if (mainRouteSource && 'setData' in mainRouteSource) {
      (mainRouteSource as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            sourceCoords,
            haltCoords,
            destCoords
          ]
        }
      });
    }

    // Update alternate route - Fix type casting for GeoJSON source
    const altRouteSource = map.current.getSource('alternate-route');
    if (altRouteSource && 'setData' in altRouteSource) {
      (altRouteSource as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            sourceCoords,
            [
              (sourceCoords[0] + destCoords[0]) / 2 + 1, 
              (sourceCoords[1] + destCoords[1]) / 2 - 1
            ] as [number, number],
            destCoords
          ]
        }
      });
    }
  };

  // Update routes when vehicle type changes
  useEffect(() => {
    if (!map.current || !routeLoaded) return;

    if (selectedVehicleType === 'army') {
      map.current.setPaintProperty('route', 'line-color', '#FF9800');
    } else {
      map.current.setPaintProperty('route', 'line-color', '#1EAEDB');
    }

  }, [selectedVehicleType, routeLoaded]);

  // Update marker positions if coordinates are changed externally
  useEffect(() => {
    if (!routeLoaded) return;
    
    sourceMarker.current?.setLngLat(sourceCoords);
    haltMarker.current?.setLngLat(haltCoords);
    destMarker.current?.setLngLat(destCoords);
    
    updateRoutes();
  }, [sourceCoords, haltCoords, destCoords, routeLoaded]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default MapComponent;
