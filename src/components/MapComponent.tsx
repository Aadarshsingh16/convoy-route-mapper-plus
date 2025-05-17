
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "sonner";
import { Bot } from "lucide-react";

interface MapComponentProps {
  source?: string;
  destination?: string;
  halts?: string[];
  selectedVehicleType: 'civil' | 'army';
  onLocationUpdate?: (type: 'source' | 'destination' | 'halt', location: string, coordinates: [number, number], haltIndex?: number) => void;
  onGenerateRoute?: () => void;
  isRouteLoading?: boolean;
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
  halts = ["Bhopal, IN"],
  selectedVehicleType,
  onLocationUpdate,
  onGenerateRoute,
  isRouteLoading = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  
  // Current coordinates being used
  const [sourceCoords, setSourceCoords] = useState<[number, number]>(demoCoordinates.newDelhi);
  const [destCoords, setDestCoords] = useState<[number, number]>(demoCoordinates.chennai);
  const [haltCoords, setHaltCoords] = useState<[number, number][]>([demoCoordinates.bhopal]);
  
  // Markers
  const sourceMarker = useRef<mapboxgl.Marker | null>(null);
  const destMarker = useRef<mapboxgl.Marker | null>(null);
  const haltMarkers = useRef<mapboxgl.Marker[]>([]);

  // Custom marker element creator
  const createMarkerElement = (color: string) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
    return el;
  };

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
    
    // Add route when map loads
    map.current.on('load', () => {
      if (!map.current) return;

      // Add markers for source, halt, and destination
      sourceMarker.current = new mapboxgl.Marker({ 
        element: createMarkerElement('#4CAF50')
      })
        .setLngLat(sourceCoords)
        .addTo(map.current);

      haltMarkers.current = halts.map((_, index) => {
        const marker = new mapboxgl.Marker({ 
          element: createMarkerElement('#2196F3') 
        })
          .setLngLat(index === 0 ? haltCoords[0] : demoCoordinates.bhopal)
          .addTo(map.current!);
          
        // Allow markers to be draggable
        marker.setDraggable(true);
        
        // Add drag end events
        marker.on('dragend', () => {
          if (!marker) return;
          const newCoords = marker.getLngLat();
          const newHaltCoords = [...haltCoords];
          newHaltCoords[index] = [newCoords.lng, newCoords.lat];
          setHaltCoords(newHaltCoords);
          updateRoutes();
          if (onLocationUpdate) {
            onLocationUpdate('halt', `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`, [newCoords.lng, newCoords.lat], index);
          }
        });
          
        return marker;
      });

      destMarker.current = new mapboxgl.Marker({ 
        element: createMarkerElement('#F44336')
      })
        .setLngLat(destCoords)
        .addTo(map.current);

      // Allow markers to be draggable
      sourceMarker.current.setDraggable(true);
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
              ...(haltCoords || []),
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
          'line-width': 4,
          'line-opacity': 0.8
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
          'line-dasharray': [2, 2],
          'line-opacity': 0.6
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
            ...haltCoords,
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

  // Animation for route generation
  useEffect(() => {
    if (isRouteLoading && map.current && routeLoaded) {
      setAnimationInProgress(true);
      
      // Animate route generation
      let step = 0;
      const steps = 30;
      const animationInterval = setInterval(() => {
        step++;
        
        if (step >= steps) {
          clearInterval(animationInterval);
          setAnimationInProgress(false);
          return;
        }
        
        // Update route line animation
        map.current?.setPaintProperty('route', 'line-dasharray', [2, 4 * (1 - step/steps)]);
      }, 50);
      
      return () => clearInterval(animationInterval);
    }
  }, [isRouteLoading, routeLoaded]);

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
    
    haltCoords.forEach((coords, index) => {
      if (index < haltMarkers.current.length) {
        haltMarkers.current[index].setLngLat(coords);
      }
    });
    
    destMarker.current?.setLngLat(destCoords);
    
    updateRoutes();
  }, [sourceCoords, haltCoords, destCoords, routeLoaded]);

  // Update halt markers when new halts are added
  useEffect(() => {
    if (!map.current || !routeLoaded) return;
    
    // Remove existing halt markers
    haltMarkers.current.forEach(marker => marker.remove());
    
    // Create new markers for each halt
    if (halts.length > haltCoords.length) {
      // Add new default coordinates
      const newHaltCoords = [...haltCoords];
      for (let i = haltCoords.length; i < halts.length; i++) {
        newHaltCoords.push(demoCoordinates.bhopal);
      }
      setHaltCoords(newHaltCoords);
    }
    
    // Create markers for each halt
    haltMarkers.current = halts.map((_, index) => {
      const coords = index < haltCoords.length ? haltCoords[index] : demoCoordinates.bhopal;
      const marker = new mapboxgl.Marker({ 
        element: createMarkerElement('#2196F3')
      })
        .setLngLat(coords)
        .addTo(map.current!);
        
      // Allow markers to be draggable
      marker.setDraggable(true);
      
      // Add drag end events
      marker.on('dragend', () => {
        if (!marker) return;
        const newCoords = marker.getLngLat();
        const newHaltCoords = [...haltCoords];
        newHaltCoords[index] = [newCoords.lng, newCoords.lat];
        setHaltCoords(newHaltCoords);
        updateRoutes();
        if (onLocationUpdate) {
          onLocationUpdate('halt', `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`, [newCoords.lng, newCoords.lat], index);
        }
      });
      
      return marker;
    });
    
    updateRoutes();
  }, [halts.length, routeLoaded]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {animationInProgress && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-white">Calculating route...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
