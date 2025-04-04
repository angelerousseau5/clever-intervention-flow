
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { Ticket } from "@/hooks/useTickets";

const InterventionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [intervention, setIntervention] = useState<Ticket | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        setIntervention(data);
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

  const handleDownloadPDF = () => {
    // For demo purposes - in a real app, this would generate a PDF from the intervention data
    toast({
      title: "Téléchargement",
      description: "Téléchargement du document en cours...",
    });
    
    // Create a simple text representation of the data for demo
    if (intervention) {
      const content = `
Intervention #${intervention.id}
Titre: ${intervention.title}
Description: ${intervention.description || 'N/A'}
Type: ${intervention.type}
Statut: ${intervention.status}
Date: ${new Date(intervention.created_at).toLocaleDateString()}
      `;
      
      // Create a Blob and download it
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `intervention-${intervention.id.slice(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
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
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionForm;
