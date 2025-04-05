
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, ArrowLeft, Save } from "lucide-react";
import { Ticket } from "@/hooks/useTickets";
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
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface CustomField {
  name: string;
  label: string;
  type: string;
  value: string;
  options?: string[];
}

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

        setIntervention(data as Ticket);
        
        // Initialize form values
        if (data.form_data) {
          try {
            const parsedFormData = JSON.parse(data.form_data);
            if (parsedFormData.customFields) {
              setCustomFields(parsedFormData.customFields);
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
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Intervention #${intervention.id.slice(0, 8)}`, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(intervention.created_at).toLocaleDateString()}`, 14, 30);
    
    // Add basic information
    doc.setFontSize(12);
    doc.text("Informations générales", 14, 40);
    
    // Create table for basic info
    const basicInfo = [
      ["Titre", intervention.title],
      ["Type", intervention.type],
      ["Statut", intervention.status],
      ["Technicien", intervention.assigned_to || "Non assigné"]
    ];
    
    (doc as any).autoTable({
      startY: 45,
      head: [["Champ", "Valeur"]],
      body: basicInfo,
      theme: 'striped',
      headStyles: { fillColor: [93, 93, 134], textColor: 255 }
    });
    
    // Add custom fields if any
    if (customFields.length > 0) {
      const fieldsY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Champs spécifiques", 14, fieldsY);
      
      const customData = customFields.map(field => [
        field.label,
        formValues[field.name] || "Non renseigné"
      ]);
      
      (doc as any).autoTable({
        startY: fieldsY + 5,
        head: [["Champ", "Valeur"]],
        body: customData,
        theme: 'striped',
        headStyles: { fillColor: [93, 93, 134], textColor: 255 }
      });
    }
    
    // Add description
    const descY = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Description", 14, descY);
    
    (doc as any).autoTable({
      startY: descY + 5,
      body: [[intervention.description || "Aucune description fournie."]],
      theme: 'plain'
    });
    
    // Add submission info if submitted
    if (formSubmitted) {
      const submissionY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Informations de soumission", 14, submissionY);
      
      const submissionInfo = [
        ["Nom", `${accessInfo?.firstName} ${accessInfo?.lastName}`],
        ["Entreprise", accessInfo?.companyName],
        ["Date de soumission", new Date().toLocaleDateString()]
      ];
      
      (doc as any).autoTable({
        startY: submissionY + 5,
        body: submissionInfo,
        theme: 'striped'
      });
    }
    
    // Save the PDF
    doc.save(`intervention-${intervention.id.slice(0, 8)}.pdf`);
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
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate('/intervention')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
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

          {intervention && (
            <div className="space-y-6">
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

              {customFields.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Formulaire à remplir</h2>
                  <div className="mt-4 space-y-4">
                    {customFields.map((field, index) => (
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
              )}

              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <div className="mt-2 p-4 bg-gray-50 rounded min-h-[100px]">
                  {intervention.description || "Aucune description fournie."}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Informations d'accès</h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">{accessInfo?.firstName} {accessInfo?.lastName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Entreprise</p>
                    <p className="font-medium">{accessInfo?.companyName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Date d'accès</p>
                    <p className="font-medium">{accessInfo?.accessedAt && new Date(accessInfo.accessedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {!formSubmitted && customFields.length > 0 && (
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
              )}
              
              {formSubmitted && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800 font-medium">
                    Ce formulaire a été soumis avec succès.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionForm;
