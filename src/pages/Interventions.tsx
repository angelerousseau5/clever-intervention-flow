
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Eye, Edit, Info } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Interventions = () => {
  const { getTickets, deleteTicket, isLoading, error } = useTickets();
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Ticket[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  const fetchInterventions = useCallback(async () => {
    if (!user || hasFetched) return;
    
    try {
      const data = await getTickets();
      setInterventions(data);
      setHasFetched(true);
    } catch (err) {
      console.error("Erreur lors de la récupération des interventions:", err);
      toast({
        title: "Erreur",
        description: "Problème lors du chargement des interventions. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
    }
  }, [getTickets, user, hasFetched]);

  useEffect(() => {
    if (user && (!hasFetched || refreshTrigger > 0)) {
      fetchInterventions();
    }
  }, [user, fetchInterventions, refreshTrigger, hasFetched]);

  const handleDownload = (intervention: Ticket) => {
    try {
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
      if (intervention.form_data) {
        try {
          const formData = JSON.parse(intervention.form_data);
          if (formData.customFields && formData.values) {
            const fieldsY = (doc as any).lastAutoTable.finalY + 10;
            doc.text("Champs spécifiques", 14, fieldsY);
            
            const customData = formData.customFields.map((field: any) => [
              field.label,
              formData.values[field.name] || "Non renseigné"
            ]);
            
            (doc as any).autoTable({
              startY: fieldsY + 5,
              head: [["Champ", "Valeur"]],
              body: customData,
              theme: 'striped',
              headStyles: { fillColor: [93, 93, 134], textColor: 255 }
            });
          }
        } catch (e) {
          console.error("Error parsing form data:", e);
        }
      }
      
      // Add description
      const descY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Description", 14, descY);
      
      (doc as any).autoTable({
        startY: descY + 5,
        body: [[intervention.description || "Aucune description fournie."]],
        theme: 'plain'
      });
      
      // Save the PDF
      doc.save(`intervention-${intervention.id.slice(0, 8)}.pdf`);
      
      toast({
        title: "Téléchargement réussi",
        description: `L'intervention ${intervention.id.slice(0, 8)} a été téléchargée`,
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      const success = await deleteTicket(id);
      if (success) {
        setHasFetched(false);
        setRefreshTrigger(prev => prev + 1); // Déclencher un rafraîchissement
      }
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/dashboard/create-ticket?edit=${id}`);
  };
  
  const getFormStatus = (intervention: Ticket) => {
    if (!intervention.form_data) {
      return "Non rempli";
    }
    
    try {
      const formData = JSON.parse(intervention.form_data);
      return formData.submitted ? "Complété" : "Partiellement rempli";
    } catch (e) {
      return "Erreur";
    }
  };
  
  const getFormStatusClass = (status: string) => {
    switch (status) {
      case "Complété":
        return "bg-green-100 text-green-800";
      case "Partiellement rempli":
        return "bg-blue-100 text-blue-800";
      case "Non rempli":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interventions</h1>
          <FileText className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Erreur lors du chargement des interventions</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setHasFetched(false);
                  setRefreshTrigger(prev => prev + 1);
                }}
              >
                Réessayer
              </Button>
            </div>
          ) : interventions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune intervention trouvée</p>
              <Button className="mt-4">
                <Link to="/dashboard/create-ticket">Créer une intervention</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Référence
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Les techniciens peuvent accéder au formulaire avec les 8 premiers caractères</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>État du formulaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((intervention) => {
                  const formStatus = getFormStatus(intervention);
                  return (
                    <TableRow key={intervention.id}>
                      <TableCell className="font-mono">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">{intervention.id.slice(0, 8)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ID complet : {intervention.id}</p>
                              <p className="text-xs text-muted-foreground mt-1">Les techniciens n'ont besoin que des 8 premiers caractères</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{intervention.title}</TableCell>
                      <TableCell>{new Date(intervention.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{intervention.type}</TableCell>
                      <TableCell>{intervention.assigned_to || "Non assigné"}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getFormStatusClass(formStatus)}`}
                        >
                          {formStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Voir les détails"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Détails de l'intervention #{intervention.id.slice(0, 8)}</DialogTitle>
                                <DialogDescription>
                                  Créée le {new Date(intervention.created_at).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <p className="font-medium">{intervention.status}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded">
                                    <p className="text-sm text-gray-500">Technicien</p>
                                    <p className="font-medium">{intervention.assigned_to || "Non assigné"}</p>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-gray-50 rounded">
                                  <p className="text-sm text-gray-500">Description</p>
                                  <p className="font-medium">{intervention.description || "Aucune description"}</p>
                                </div>
                                
                                {intervention.form_data && (
                                  <div>
                                    <h4 className="font-medium text-lg mt-4">Données du formulaire</h4>
                                    {(() => {
                                      try {
                                        const formData = JSON.parse(intervention.form_data);
                                        if (formData.customFields && formData.values) {
                                          return (
                                            <div className="mt-2 space-y-3">
                                              {formData.customFields.map((field: any) => (
                                                <div key={field.name} className="p-3 bg-gray-50 rounded">
                                                  <p className="text-sm text-gray-500">{field.label}</p>
                                                  <p className="font-medium">{formData.values[field.name] || "Non renseigné"}</p>
                                                </div>
                                              ))}
                                              
                                              {formData.submittedBy && (
                                                <div className="mt-4 p-3 bg-green-50 rounded">
                                                  <p className="text-sm text-green-800">Soumis par {formData.submittedBy.firstName} {formData.submittedBy.lastName} ({formData.submittedBy.companyName})</p>
                                                  <p className="text-sm text-green-800">Le {new Date(formData.submittedBy.submittedAt).toLocaleString()}</p>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                        return <p>Aucune donnée de formulaire disponible</p>;
                                      } catch (e) {
                                        return <p className="text-red-500">Erreur lors de la lecture des données du formulaire</p>;
                                      }
                                    })()}
                                  </div>
                                )}
                                
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleDownload(intervention)}
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Télécharger PDF
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(intervention)}
                            title="Télécharger l'intervention"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(intervention.id)}
                            title="Modifier l'intervention"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(intervention.id)}
                            className="text-red-500"
                            title="Supprimer l'intervention"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interventions;
