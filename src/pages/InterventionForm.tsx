
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/hooks/useTickets";
import { InterventionHeader } from "@/components/intervention/InterventionHeader";
import { InterventionGeneralInfo } from "@/components/intervention/InterventionGeneralInfo";
import { CustomFormFields } from "@/components/intervention/CustomFormFields";
import { InterventionDescription } from "@/components/intervention/InterventionDescription";
import { InterventionAccessInfo } from "@/components/intervention/InterventionAccessInfo";
import { SubmitFormSection } from "@/components/intervention/SubmitFormSection";
import { generateInterventionPDF } from "@/components/intervention/PDFGenerator";
import { useNavigate } from "react-router-dom";
import { CustomField } from "@/types/formTypes";

const InterventionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [intervention, setIntervention] = useState<Ticket | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Verify access permissions from localStorage
    const storedAccess = localStorage.getItem('interventionAccess');
    if (!storedAccess) {
      toast({
        title: "Accès refusé",
        description: "Veuillez vous identifier pour accéder au formulaire.",
        variant: "destructive",
      });
      navigate('/intervention');
      return;
    }

    const accessData = JSON.parse(storedAccess);
    
    // Verify the ticket ID matches
    if (accessData.ticketId !== id) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès à ce formulaire.",
        variant: "destructive",
      });
      navigate('/intervention');
      return;
    }

    setAccessInfo(accessData);
    
    // Fetch intervention details
    const fetchIntervention = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          throw new Error(error?.message || "Formulaire introuvable");
        }

        // Ensure data is cast to the Ticket type with form_data
        const typedData = data as Ticket;
        setIntervention(typedData);
        
        // Initialize form values
        if (typedData.form_data) {
          try {
            const parsedFormData = JSON.parse(typedData.form_data);
            if (parsedFormData.customFields) {
              // Convert the custom fields to match the expected type
              const formattedFields = parsedFormData.customFields.map((field: any) => ({
                id: field.id || field.name,
                type: field.type,
                name: field.name,
                label: field.label,
                required: field.required !== undefined ? field.required : false,
                options: field.options,
                defaultValue: field.value || field.defaultValue,
              }));
              setCustomFields(formattedFields);
            }
            if (parsedFormData.values) {
              setFormValues(parsedFormData.values);
            }
            if (parsedFormData.submitted) {
              setFormSubmitted(true);
            }
          } catch (e) {
            console.error("Error parsing form data:", e);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du formulaire.",
          variant: "destructive",
        });
        navigate('/intervention');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntervention();
  }, [id, navigate, toast]);

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      
      if (!intervention || !id) {
        throw new Error("Données de formulaire manquantes");
      }
      
      // Prepare form data to save
      const formData = {
        customFields,
        values: formValues,
        submitted: true,
        submittedBy: {
          firstName: accessInfo?.firstName,
          lastName: accessInfo?.lastName,
          companyName: accessInfo?.companyName,
          submittedAt: new Date().toISOString()
        }
      };
      
      // Update ticket with form data and change status
      const { error } = await supabase
        .from('tickets')
        .update({
          form_data: JSON.stringify(formData),
          status: "Terminé",
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setFormSubmitted(true);
      toast({
        title: "Succès",
        description: "Le formulaire a été soumis avec succès",
      });
      
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le formulaire. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const generatePDF = () => {
    if (!intervention) return;
    generateInterventionPDF({
      intervention,
      customFields,
      formValues,
      formSubmitted,
      accessInfo
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto mt-16 px-4 sm:px-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
        {intervention && (
          <>
            <InterventionHeader 
              intervention={intervention} 
              generatePDF={generatePDF} 
            />
            
            <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
              <div className="space-y-6">
                <InterventionGeneralInfo intervention={intervention} />
                
                {customFields.length > 0 && (
                  <CustomFormFields 
                    customFields={customFields}
                    formValues={formValues}
                    handleInputChange={handleInputChange}
                    formSubmitted={formSubmitted}
                  />
                )}
                
                <InterventionDescription intervention={intervention} />
                
                <InterventionAccessInfo accessInfo={accessInfo} />
                
                <SubmitFormSection 
                  handleSubmit={handleSubmit}
                  isSaving={isSaving}
                  formSubmitted={formSubmitted}
                  customFieldsExist={customFields.length > 0}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterventionForm;
