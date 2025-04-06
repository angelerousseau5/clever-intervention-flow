
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CustomField {
  name: string;
  label: string;
  type: string;
  value: string;
  options?: string[];
}

interface CustomFormFieldsProps {
  customFields: CustomField[];
  formValues: Record<string, string>;
  handleInputChange: (name: string, value: string) => void;
  formSubmitted: boolean;
}

export const CustomFormFields: React.FC<CustomFormFieldsProps> = ({
  customFields,
  formValues,
  handleInputChange,
  formSubmitted
}) => {
  if (customFields.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-muted-foreground italic">
          Aucun champ personnalisé n'a été ajouté.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Formulaire à remplir</h2>
      <div className="mt-4 space-y-4">
        {customFields.map((field) => (
          <div key={field.name} className="border p-4 rounded-md">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>
            <div className="mt-2">
              {field.type === 'input' && (
                <Input
                  id={field.name}
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Entrez ${field.label.toLowerCase()}`}
                  disabled={formSubmitted}
                />
              )}
              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Entrez ${field.label.toLowerCase()}`}
                  disabled={formSubmitted}
                />
              )}
              {field.type === 'select' && (
                <Select 
                  onValueChange={(value) => handleInputChange(field.name, value)}
                  value={formValues[field.name] || ''}
                  disabled={formSubmitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Sélectionnez ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
