
import React from 'react';
import { Ticket } from "@/hooks/useTickets";

interface InterventionDescriptionProps {
  intervention: Ticket;
}

export const InterventionDescription: React.FC<InterventionDescriptionProps> = ({ 
  intervention 
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Description</h2>
      <div className="mt-2 p-4 bg-gray-50 rounded min-h-[100px]">
        {intervention.description || "Aucune description fournie."}
      </div>
    </div>
  );
};
