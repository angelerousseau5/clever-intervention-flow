
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: "Total Interventions",
      value: "24",
      icon: FileText,
      description: "Toutes les interventions",
      color: "blue",
    },
    {
      title: "Interventions Complétées",
      value: "16",
      icon: CheckCircle,
      description: "66% terminées",
      color: "green",
    },
    {
      title: "Interventions En Attente",
      value: "8",
      icon: AlertCircle,
      description: "33% en attente",
      color: "orange",
    },
  ];

  // Recent items mock data
  const recentItems = [
    {
      id: "INT-12345",
      title: "Maintenance préventive",
      date: "08/04/2025",
      status: "Complété",
      technician: "Michel Dupont",
    },
    {
      id: "INT-12344",
      title: "Réparation climatiseur",
      date: "07/04/2025",
      status: "En attente",
      technician: "Sarah Martin",
    },
    {
      id: "INT-12343",
      title: "Installation équipement",
      date: "05/04/2025",
      status: "Complété",
      technician: "Jean Leroux",
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

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
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

        {/* Recent interventions */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Référence</th>
                    <th className="text-left py-3 px-2">Titre</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Technicien</th>
                    <th className="text-left py-3 px-2">Statut</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-2 font-medium">{item.id}</td>
                      <td className="py-3 px-2">{item.title}</td>
                      <td className="py-3 px-2">{item.date}</td>
                      <td className="py-3 px-2">{item.technician}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "Complété"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
