
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

const Interventions = () => {
  // Mock data for interventions
  const interventions = [
    {
      id: "INT-001",
      title: "Maintenance Serveur",
      date: "2025-04-05",
      status: "En cours",
      technicien: "Jean Martin",
      type: "Maintenance",
    },
    {
      id: "INT-002",
      title: "Installation Réseau",
      date: "2025-04-04",
      status: "Terminé",
      technicien: "Sophie Dubois",
      type: "Installation",
    },
    {
      id: "INT-003",
      title: "Dépannage PC",
      date: "2025-04-03",
      status: "En attente",
      technicien: "Pierre Durand",
      type: "Dépannage",
    },
  ];

  const handleDownload = (id: string) => {
    console.log("Téléchargement de l'intervention:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Suppression de l'intervention:", id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interventions</h1>
          <FileText className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white rounded-lg shadow">
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
                  <TableCell>{intervention.id}</TableCell>
                  <TableCell>{intervention.title}</TableCell>
                  <TableCell>{intervention.date}</TableCell>
                  <TableCell>{intervention.type}</TableCell>
                  <TableCell>{intervention.technicien}</TableCell>
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
                        onClick={() => handleDownload(intervention.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(intervention.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interventions;
