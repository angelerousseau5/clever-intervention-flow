
import React from 'react';
import { Ticket } from "@/hooks/useTickets";

interface InterventionGeneralInfoProps {
  intervention: Ticket;
}

export const InterventionGeneralInfo: React.FC<InterventionGeneralInfoProps> = ({ 
  intervention 
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Informations générales</h2>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Titre</p>
          <p className="font-medium">{intervention.title}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-medium">{intervention.type}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Statut</p>
          <p className="font-medium">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                intervention.status === "Terminé"
                  ? "bg-green-100 text-green-800"
                  : intervention.status === "En cours"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {intervention.status}
            </span>
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Assigné à</p>
          <p className="font-medium">{intervention.assigned_to || "Non assigné"}</p>
        </div>
      </div>
    </div>
  );
};
