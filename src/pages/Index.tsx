
import React, { useState, useCallback } from 'react';
import MapComponent from '../components/MapComponent';
import VehicleSelector from '../components/VehicleSelector';
import ConvoySidebar from '../components/ConvoySidebar';
import ConvoyInfo from '../components/ConvoyInfo';
import { Toaster } from "sonner";
import { toast } from "sonner";

const Index = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<'civil' | 'army'>('civil');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  
  // Location state
  const [convoyData, setConvoyData] = useState({
    source: "New Delhi, IN",
    destination: "Chennai, IN",
    halts: ["Bhopal, IN"],
    convoyId: "CV-2024-01"
  });
  
  // Function to handle location updates from the map
  const handleLocationUpdate = useCallback((
    type: 'source' | 'destination' | 'halt', 
    location: string, 
    coordinates: [number, number],
    haltIndex?: number
  ) => {
    if (type === 'halt' && haltIndex !== undefined) {
      setConvoyData(prev => {
        const newHalts = [...prev.halts];
        newHalts[haltIndex] = location;
        return { ...prev, halts: newHalts };
      });
    } else {
      setConvoyData(prev => ({
        ...prev,
        [type]: location
      }));
    }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated to coordinates`);
  }, []);
  
  // Functions to handle location updates from the sidebar
  const handleUpdateSource = useCallback((source: string) => {
    setConvoyData(prev => ({ ...prev, source }));
  }, []);
  
  const handleUpdateDestination = useCallback((destination: string) => {
    setConvoyData(prev => ({ ...prev, destination }));
  }, []);
  
  const handleAddHalt = useCallback((halt: string) => {
    setConvoyData(prev => ({
      ...prev,
      halts: [...prev.halts, halt]
    }));
  }, []);
  
  // Generate route with animation
  const handleGenerateRoute = useCallback(() => {
    setIsRouteLoading(true);
    
    // Simulate route calculation delay
    setTimeout(() => {
      setIsRouteLoading(false);
      toast.success("Route generated successfully!");
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-convoy-dark flex">
      <Toaster position="top-center" />
      
      <div className="fixed left-4 top-4 z-20">
        <ConvoySidebar 
          onAddHalt={handleAddHalt}
          onUpdateSource={handleUpdateSource}
          onUpdateDestination={handleUpdateDestination}
          onGenerateRoute={handleGenerateRoute}
        />
      </div>
      
      {/* Map covering the entire screen */}
      <div className="w-full h-screen">
        <MapComponent 
          source={convoyData.source}
          destination={convoyData.destination}
          halts={convoyData.halts}
          selectedVehicleType={selectedVehicleType}
          onLocationUpdate={handleLocationUpdate}
          isRouteLoading={isRouteLoading}
        />
        
        {/* Info Card - Positioned top right */}
        <div className="fixed top-4 right-4 z-10 bg-black/40 backdrop-blur-sm rounded-lg p-4">
          <ConvoyInfo 
            source={convoyData.source}
            destination={convoyData.destination}
            halt={convoyData.halts[0]}
            convoyId={convoyData.convoyId}
          />
        </div>
        
        {/* Vehicle Selection Section - Positioned bottom */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-auto bg-black/40 backdrop-blur-sm rounded-lg">
          <VehicleSelector 
            selectedVehicleType={selectedVehicleType}
            setSelectedVehicleType={setSelectedVehicleType}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
