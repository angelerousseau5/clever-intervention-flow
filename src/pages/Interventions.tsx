
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
import { FileText, Download, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Interventions = () => {
  const { getTickets, deleteTicket, isLoading, error } = useTickets();
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Ticket[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

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
    // Create a text representation of the intervention data
    const content = `
Intervention #${intervention.id}
Titre: ${intervention.title}
Description: ${intervention.description || 'N/A'}
Type: ${intervention.type}
Statut: ${intervention.status}
Date: ${new Date(intervention.created_at).toLocaleDateString()}
Technicien: ${intervention.assigned_to || 'Non assigné'}
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
    
    toast({
      title: "Téléchargement réussi",
      description: `L'intervention ${intervention.id.slice(0, 8)} a été téléchargée`,
    });
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
                  <TableHead>Référence</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell>{intervention.id.slice(0, 8)}</TableCell>
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
                      <div className="flex gap-2">
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
                          onClick={() => handleDelete(intervention.id)}
                          className="text-red-500"
                          title="Supprimer l'intervention"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interventions;
