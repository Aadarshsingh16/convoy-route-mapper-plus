
import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import VehicleSelector from '../components/VehicleSelector';
import ConvoySidebar from '../components/ConvoySidebar';
import ConvoyInfo from '../components/ConvoyInfo';
import { Toaster } from "sonner";

const Index = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<'civil' | 'army'>('civil');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Example convoy data
  const convoyData = {
    source: "New Delhi, IN",
    destination: "Chennai, IN",
    halt: "Bhopal, IN",
    convoyId: "CV-2024-01"
  };

  return (
    <div className="min-h-screen bg-convoy-dark flex flex-col">
      <Toaster position="top-center" />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="p-4">
          <ConvoySidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="relative flex-1 mb-4">
            <MapComponent 
              source={convoyData.source}
              destination={convoyData.destination}
              halt={convoyData.halt}
              selectedVehicleType={selectedVehicleType}
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
