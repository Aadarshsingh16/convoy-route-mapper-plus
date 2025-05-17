import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Truck, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
interface ConvoySidebarProps {
  onAddHalt?: (halt: string) => void;
  onUpdateSource?: (source: string) => void;
  onUpdateDestination?: (destination: string) => void;
  onGenerateRoute?: () => void;
}
const ConvoySidebar: React.FC<ConvoySidebarProps> = ({
  onAddHalt,
  onUpdateSource,
  onUpdateDestination,
  onGenerateRoute
}) => {
  const [haltInput, setHaltInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const handleAddHalt = () => {
    if (haltInput.trim()) {
      onAddHalt?.(haltInput.trim());
      toast.success(`Halt added: ${haltInput}`);
      setHaltInput('');
    } else {
      toast.error("Please enter a valid halt location");
    }
  };
  const handleUpdateSource = () => {
    if (sourceInput.trim()) {
      onUpdateSource?.(sourceInput.trim());
      toast.success(`Source updated: ${sourceInput}`);
    } else {
      toast.error("Please enter a valid source location");
    }
  };
  const handleUpdateDestination = () => {
    if (destinationInput.trim()) {
      onUpdateDestination?.(destinationInput.trim());
      toast.success(`Destination updated: ${destinationInput}`);
    } else {
      toast.error("Please enter a valid destination location");
    }
  };
  const handleGenerateRoute = () => {
    onGenerateRoute?.();
    toast.success("Generating route...");
  };
  return <div className="convoy-sidebar rounded-lg p-4 w-64 text-white bg-black/30 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">ROUTE PLAN</h2>
      </div>

      <div className="space-y-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Update Source</label>
          <div className="flex gap-2">
            <Input placeholder="Enter source location" className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400" value={sourceInput} onChange={e => setSourceInput(e.target.value)} />
            <Button size="sm" variant="outline" onClick={handleUpdateSource}>
              <MapPin size={16} className="text-gray-400" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Add Sub Halts</label>
          <div className="flex gap-2">
            <Input placeholder="Add halt location" className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400" value={haltInput} onChange={e => setHaltInput(e.target.value)} />
            <Button size="sm" variant="outline" onClick={handleAddHalt}>
              <MapPin size={16} className="text-gray-400" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Update Destination</label>
          <div className="flex gap-2">
            <Input placeholder="Enter destination" className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400" value={destinationInput} onChange={e => setDestinationInput(e.target.value)} />
            <Button size="sm" variant="outline" onClick={handleUpdateDestination}>
              <MapPin size={16} className="text-gray-400" />
            </Button>
          </div>
        </div>
        
        <div className="pt-4">
          <Button onClick={handleGenerateRoute} className="w-full flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-white">
            <Navigation size={16} />
            Generate Route
          </Button>
        </div>
      </div>

      <div className="my-6">
        <p className="text-sm text-gray-300 mb-2">Use convoy vehicles to convoy...</p>
      </div>
      
      <div className="mb-4">
        <Button variant="outline" className="w-full mb-3 bg-black/30 border-gray-700 text-white flex items-center justify-start space-x-2">
          <Truck size={16} />
          <span>Load Management</span>
        </Button>

        <div className="pl-4 space-y-2">
          <div className="text-sm text-gray-300">Test data 1</div>
          <div className="text-sm text-gray-300">Test data 2</div>
        </div>
      </div>
    </div>;
};
export default ConvoySidebar;
