
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SubmitFormSectionProps {
  handleSubmit: () => Promise<void>;
  isSaving: boolean;
  formSubmitted: boolean;
  customFieldsExist?: boolean; // Rendu optionnel
}

export const SubmitFormSection: React.FC<SubmitFormSectionProps> = ({
  handleSubmit,
  isSaving,
  formSubmitted,
  customFieldsExist = true // Valeur par défaut à true
}) => {
  if (formSubmitted) {
    return (
      <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-green-800 font-medium">
          Ce formulaire a été soumis avec succès.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-6 flex justify-end">
      <Button 
        onClick={handleSubmit} 
        disabled={isSaving}
        className="flex items-center"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Enregistrement..." : "Soumettre le formulaire"}
      </Button>
    </div>
  );
};
