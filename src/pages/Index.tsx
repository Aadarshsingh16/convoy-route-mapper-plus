
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
  
  // Location state
  const [convoyData, setConvoyData] = useState({
    source: "New Delhi, IN",
    destination: "Chennai, IN",
    halt: "Bhopal, IN",
    convoyId: "CV-2024-01"
  });
  
  // Function to handle location updates from the map
  const handleLocationUpdate = useCallback((type: 'source' | 'destination' | 'halt', location: string, coordinates: [number, number]) => {
    setConvoyData(prev => ({
      ...prev,
      [type]: location
    }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated to coordinates`);
  }, []);
  
  // Functions to handle location updates from the sidebar
  const handleUpdateSource = useCallback((source: string) => {
    setConvoyData(prev => ({ ...prev, source }));
    // In a real app, we would geocode this location to get coordinates
  }, []);
  
  const handleUpdateDestination = useCallback((destination: string) => {
    setConvoyData(prev => ({ ...prev, destination }));
    // In a real app, we would geocode this location to get coordinates
  }, []);
  
  const handleAddHalt = useCallback((halt: string) => {
    setConvoyData(prev => ({ ...prev, halt }));
    // In a real app, we would geocode this location to get coordinates
  }, []);

  return (
    <div className="min-h-screen bg-convoy-dark flex flex-col">
      <Toaster position="top-center" />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="p-4">
          <ConvoySidebar 
            onAddHalt={handleAddHalt}
            onUpdateSource={handleUpdateSource}
            onUpdateDestination={handleUpdateDestination}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="relative flex-1 mb-4">
            <MapComponent 
              source={convoyData.source}
              destination={convoyData.destination}
              halt={convoyData.halt}
              selectedVehicleType={selectedVehicleType}
              onLocationUpdate={handleLocationUpdate}
            />
            
            {/* Info Card - Positioned top right */}
            <div className="absolute top-4 right-4 z-10">
              <ConvoyInfo 
                source={convoyData.source}
                destination={convoyData.destination}
                halt={convoyData.halt}
                convoyId={convoyData.convoyId}
              />
            </div>
          </div>
          
          {/* Vehicle Selection Section */}
          <div className="mt-auto">
            <VehicleSelector 
              selectedVehicleType={selectedVehicleType}
              setSelectedVehicleType={setSelectedVehicleType}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
