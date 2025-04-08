import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Dashboard = () => {
  const { getTickets, isLoading, error } = useTickets();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [hasFetched, setHasFetched] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user || hasFetched) return;
    
    try {
      const data = await getTickets();
      setTickets(data);
      
      const completed = data.filter(ticket => ticket.status === "Terminé").length;
      setStats({
        total: data.length,
        completed,
        pending: data.length - completed,
      });
      
      setHasFetched(true);
    } catch (err) {
      console.error("Erreur lors de la récupération des tickets:", err);
      toast({
        title: "Erreur",
        description: "Problème lors du chargement des tickets. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
    }
  }, [getTickets, user, hasFetched]);

  useEffect(() => {
    if (user && !hasFetched) {
      fetchTickets();
    }
  }, [user, fetchTickets, hasFetched]);

  const statsItems = [
    {
      title: "Total Interventions",
      value: stats.total.toString(),
      icon: FileText,
      description: "Toutes les interventions",
      color: "blue",
    },
    {
      title: "Interventions Complétées",
      value: stats.completed.toString(),
      icon: CheckCircle,
      description: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% terminées` : "0% terminées",
      color: "green",
    },
    {
      title: "Interventions En Attente",
      value: stats.pending.toString(),
      icon: AlertCircle,
      description: stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}% en attente` : "0% en attente",
      color: "orange",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <Link to="/dashboard/create-ticket">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Ticket
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {statsItems.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className={`h-5 w-5 text-${stat.color}-500`}
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Interventions récentes
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Les techniciens peuvent accéder au formulaire avec les 8 premiers caractères</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                <p>Erreur lors du chargement des tickets</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setHasFetched(false);
                    fetchTickets();
                  }}
                >
                  Réessayer
                </Button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>Aucune intervention pour le moment</p>
                <Link to="/dashboard/create-ticket">
                  <Button variant="link" className="mt-2">
                    Créer votre première intervention
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">
                        <div className="flex items-center">
                          Référence
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Les 8 premiers caractères suffisent pour l'accès technicien</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </th>
                      <th className="text-left py-3 px-2">Titre</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Technicien</th>
                      <th className="text-left py-3 px-2">Statut</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, 3).map((ticket) => (
                      <tr key={ticket.id} className="border-b">
                        <td className="py-3 px-2 font-mono font-medium">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{ticket.id.slice(0, 8)}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ID complet : {ticket.id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="py-3 px-2">{ticket.title}</td>
                        <td className="py-3 px-2">{new Date(ticket.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-2">{ticket.assigned_to || "Non assigné"}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              ticket.status === "Terminé"
                                ? "bg-green-100 text-green-800"
                                : ticket.status === "En cours"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
