
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Folder, Users, FolderPlus, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";

// Type pour un groupe
interface Group {
  id: string;
  name: string;
  created_at: string;
  ticket_count?: number;
}

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { getTicketsByGroupId } = useTickets();

  // Simuler le chargement des groupes (à remplacer par un appel API réel)
  useEffect(() => {
    // Simuler une requête API
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // Remplacer par un appel API réel
        const storedGroups = localStorage.getItem('groups');
        const parsedGroups: Group[] = storedGroups ? JSON.parse(storedGroups) : [];
        
        // Ajouter le nombre de tickets pour chaque groupe
        const groupsWithCounts = await Promise.all(
          parsedGroups.map(async (group) => {
            const tickets = await getTicketsByGroupId(group.id);
            return {
              ...group,
              ticket_count: tickets.length
            };
          })
        );
        
        setGroups(groupsWithCounts);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les groupes",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Générer un ID aléatoire
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Ouvrir le dialogue d'ajout de groupe
  const openAddGroupDialog = () => {
    setIsEditing(false);
    setSelectedGroup(null);
    setNewGroupName("");
    setNewGroupId(generateRandomId());
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue d'édition de groupe
  const openEditGroupDialog = (group: Group) => {
    setIsEditing(true);
    setSelectedGroup(group);
    setNewGroupName(group.name);
    setNewGroupId(group.id);
    setIsDialogOpen(true);
  };

  // Sauvegarder les groupes dans localStorage
  const saveGroups = (updatedGroups: Group[]) => {
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setGroups(updatedGroups);
  };

  // Ajouter un nouveau groupe
  const addGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si l'ID est déjà utilisé
    if (groups.some(group => group.id === newGroupId)) {
      toast({
        title: "Erreur",
        description: "Cet identifiant est déjà utilisé",
        variant: "destructive",
      });
      return;
    }

    const newGroup: Group = {
      id: newGroupId,
      name: newGroupName.trim(),
      created_at: new Date().toISOString(),
      ticket_count: 0
    };

    const updatedGroups = [...groups, newGroup];
    saveGroups(updatedGroups);
    
    toast({
      title: "Groupe créé",
      description: `Le groupe "${newGroupName}" a été créé avec succès`,
    });
    
    setIsDialogOpen(false);
    setNewGroupName("");
    setNewGroupId("");
  };

  // Mettre à jour un groupe existant
  const updateGroup = () => {
    if (!selectedGroup) return;
    
    if (!newGroupName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, name: newGroupName.trim() } 
        : group
    );
    
    saveGroups(updatedGroups);
    
    toast({
      title: "Groupe mis à jour",
      description: `Le groupe a été mis à jour avec succès`,
    });
    
    setIsDialogOpen(false);
    setSelectedGroup(null);
  };

  // Supprimer un groupe
  const deleteGroup = (groupId: string) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?");
    if (!confirmDelete) return;

    const updatedGroups = groups.filter(group => group.id !== groupId);
    saveGroups(updatedGroups);
    
    toast({
      title: "Groupe supprimé",
      description: "Le groupe a été supprimé avec succès",
    });
  };

  // Créer un ticket associé à un groupe
  const createTicketInGroup = (groupId: string) => {
    navigate(`/dashboard/create-ticket?group=${groupId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Groupes</h1>
          <Button onClick={openAddGroupDialog}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Nouveau Groupe
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              <Folder className="h-4 w-4 mr-2" />
              Tous les groupes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Groupes d'interventions</CardTitle>
                <CardDescription>
                  Créez et gérez des groupes pour organiser vos tickets d'intervention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <p>Chargement des groupes...</p>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center p-8 border rounded-lg">
                    <Folder className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Aucun groupe</h3>
                    <p className="text-gray-500 mb-4">
                      Vous n'avez pas encore créé de groupe d'interventions
                    </p>
                    <Button onClick={openAddGroupDialog}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Créer un groupe
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Tickets</TableHead>
                        <TableHead>Créé le</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-mono text-xs">
                            {group.id}
                          </TableCell>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{group.ticket_count || 0}</TableCell>
                          <TableCell>
                            {new Date(group.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => createTicketInGroup(group.id)}
                              >
                                <Link className="h-4 w-4 mr-1" />
                                Ticket
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditGroupDialog(group)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => deleteGroup(group.id)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier le groupe" : "Créer un nouveau groupe"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifiez les informations de ce groupe"
                : "Entrez les informations pour créer un nouveau groupe"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-id">Identifiant</Label>
              <Input
                id="group-id"
                value={newGroupId}
                onChange={(e) => setNewGroupId(e.target.value)}
                placeholder="Identifiant unique"
                readOnly={isEditing}
                className={isEditing ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-name">Nom du groupe</Label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nom du groupe"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={isEditing ? updateGroup : addGroup}>
              {isEditing ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Groups;
