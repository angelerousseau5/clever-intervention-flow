
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "@/hooks/useTickets";

interface InterventionHeaderProps {
  intervention: Ticket;
  generatePDF: () => void;
}

export const InterventionHeader: React.FC<InterventionHeaderProps> = ({ 
  intervention, 
  generatePDF 
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate('/intervention')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Formulaire d'Intervention {intervention?.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Créé le {intervention && new Date(intervention.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={generatePDF}
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
      </div>
    </>
  );
};
