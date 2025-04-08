
import React, { useState, useEffect } from 'react';
import { Ticket } from "@/hooks/useTickets";

interface Group {
  id: string;
  name: string;
}

interface InterventionGeneralInfoProps {
  intervention: Ticket;
}

export const InterventionGeneralInfo: React.FC<InterventionGeneralInfoProps> = ({ 
  intervention 
}) => {
  const [groupName, setGroupName] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le nom du groupe si l'intervention a un groupe_id
    if (intervention.group_id) {
      const fetchGroupName = () => {
        const storedGroups = localStorage.getItem('groups');
        if (storedGroups) {
          const groups: Group[] = JSON.parse(storedGroups);
          const group = groups.find(g => g.id === intervention.group_id);
          if (group) {
            setGroupName(group.name);
          }
        }
      };
      
      fetchGroupName();
    }
  }, [intervention.group_id]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Informations générales</h2>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Titre</p>
          <p className="font-medium">{intervention.title}</p>
        </div>
        
        {groupName && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Groupe</p>
            <p className="font-medium">{groupName}</p>
          </div>
        )}

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
      </div>
    </div>
  );
};
