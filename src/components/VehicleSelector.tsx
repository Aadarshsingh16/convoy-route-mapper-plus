
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Truck } from "lucide-react";

interface VehicleType {
  type: string;
  icon: React.ReactNode;
  capacity: string;
}

interface VehicleSelectorProps {
  selectedVehicleType: 'civil' | 'army';
  setSelectedVehicleType: (type: 'civil' | 'army') => void;
  selectedVehicle: VehicleType | null;
  setSelectedVehicle: (vehicle: VehicleType) => void;
}

const civilVehicles: VehicleType[] = [
  {
    type: "Pickup Truck",
    icon: <img src="/placeholder.svg" alt="Pickup Truck" className="w-16 h-16" />,
    capacity: "5000kg"
  },
  {
    type: "Ashok Leyland",
    icon: <img src="/placeholder.svg" alt="Ashok Leyland" className="w-16 h-16" />,
    capacity: "4000kg"
  },
  {
    type: "Small Truck",
    icon: <img src="/placeholder.svg" alt="Small Truck" className="w-16 h-16" />,
    capacity: "3000kg"
  },
  {
    type: "MAN Truck",
    icon: <img src="/placeholder.svg" alt="MAN Truck" className="w-16 h-16" />,
    capacity: "3000kg"
  }
];

const armyVehicles: VehicleType[] = [
  {
    type: "Military Truck",
    icon: <img src="/placeholder.svg" alt="Military Truck" className="w-16 h-16" />,
    capacity: "6000kg"
  },
  {
    type: "Armored Carrier",
    icon: <img src="/placeholder.svg" alt="Armored Carrier" className="w-16 h-16" />,
    capacity: "4500kg"
  },
  {
    type: "Transport Vehicle",
    icon: <img src="/placeholder.svg" alt="Transport Vehicle" className="w-16 h-16" />,
    capacity: "5500kg"
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicleType,
  setSelectedVehicleType,
  selectedVehicle,
  setSelectedVehicle
}) => {
  
  const handleVehicleSelect = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
  };

  const vehicles = selectedVehicleType === 'civil' ? civilVehicles : armyVehicles;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <div className="text-white mb-4 text-xl font-semibold">
        Civil Vehicle
      </div>
      
      <Tabs defaultValue="civil" value={selectedVehicleType} onValueChange={(value) => setSelectedVehicleType(value as 'civil' | 'army')} className="w-full">
        <TabsList className="vehicle-type-tabs grid w-full grid-cols-2 h-12">
          <TabsTrigger value="army" className="text-base">Army Vehicles</TabsTrigger>
          <TabsTrigger value="civil" className="text-base">Civil Vehicles</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {vehicles.map((vehicle, index) => (
          <div 
            key={index}
            className={`vehicle-option flex flex-col items-center p-4 rounded-md cursor-pointer border border-gray-700 bg-black/50 ${selectedVehicle?.type === vehicle.type ? 'selected' : ''}`}
            onClick={() => handleVehicleSelect(vehicle)}
          >
            <div className="mb-2">
              {vehicle.icon}
            </div>
            <div className="text-sm text-white mt-2">{vehicle.type}</div>
            <div className="text-xs text-gray-300 mt-1">Capacity: {vehicle.capacity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;
