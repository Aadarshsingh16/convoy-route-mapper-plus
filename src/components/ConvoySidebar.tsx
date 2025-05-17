
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Truck } from "lucide-react";

const ConvoySidebar: React.FC = () => {
  return (
    <div className="convoy-sidebar rounded-lg p-4 w-64 text-white">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Convoy (Team)</h2>
      </div>

      <Button variant="outline" className="w-full mb-4 bg-opacity-20 bg-black border-gray-700 text-white flex items-center justify-start space-x-2">
        <Users size={16} />
        <span>Invite convoy</span>
      </Button>

      <div className="space-y-2 mb-4">
        <Input 
          placeholder="Add Sub Halts" 
          className="bg-opacity-20 bg-black border-gray-700 text-white placeholder:text-gray-400" 
        />
        <Input 
          placeholder="Enter end halt" 
          className="bg-opacity-20 bg-black border-gray-700 text-white placeholder:text-gray-400" 
        />
        <Input 
          placeholder="" 
          className="bg-opacity-20 bg-black border-gray-700 text-white placeholder:text-gray-400" 
        />
      </div>

      <div className="my-6">
        <p className="text-sm text-gray-300 mb-2">Use convoy vehicles to convoy...</p>
      </div>
      
      <div className="mb-4">
        <Button variant="outline" className="w-full mb-3 bg-opacity-20 bg-black border-gray-700 text-white flex items-center justify-start space-x-2">
          <Truck size={16} />
          <span>Load Management</span>
        </Button>

        <div className="pl-4 space-y-2">
          <div className="text-sm text-gray-300">Test data 1</div>
          <div className="text-sm text-gray-300">Test data 2</div>
        </div>
      </div>
    </div>
  );
};

export default ConvoySidebar;
