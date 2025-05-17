import React from 'react';
interface ConvoyInfoProps {
  source: string;
  destination: string;
  halt: string;
  convoyId: string;
}
const ConvoyInfo: React.FC<ConvoyInfoProps> = ({
  source,
  destination,
  halt,
  convoyId
}) => {
  return <div className="convoy-card rounded-lg p-4 w-64 text-white max-w-xs">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">CONVOY DEPARTING</h2>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <span className="font-medium">{source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <span className="font-medium">{destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reached Sub Halt:</span>
            <span className="font-medium">{halt}</span>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <span className="text-gray-400 py-[2px] my-0 mx-0">Convoy ID:</span>
          <span className="font-medium">{convoyId}</span>
        </div>
      </div>
    </div>;
};
export default ConvoyInfo;