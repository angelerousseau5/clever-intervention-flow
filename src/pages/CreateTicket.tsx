
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTickets } from "@/hooks/useTickets";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

// Schéma de validation du formulaire
const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  type: z.string().min(1, "Veuillez sélectionner un type"),
  priority: z.string().min(1, "Veuillez sélectionner une priorité"),
  assigned_to: z.string().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.string().default("En attente"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTicket = () => {
  const { createTicket, isLoading } = useTickets();
  const navigate = useNavigate();
  const [customTypeInput, setCustomTypeInput] = useState("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      priority: "",
      assigned_to: "",
      description: "",
      status: "En attente",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const ticket = await createTicket({
      title: values.title,
      description: values.description,
      status: values.status,
      type: values.type,
      assigned_to: values.assigned_to || "",
    });
    
    if (ticket) {
      navigate("/dashboard/interventions");
    }
  };

  const addCustomType = () => {
    if (customTypeInput.trim()) {
      setCustomTypes([...customTypes, customTypeInput.trim()]);
      setCustomTypeInput("");
      setShowCustomTypeInput(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nouveau Ticket</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du ticket</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Titre de l'intervention" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez ou créez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="undefined">À définir par le technicien</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="installation">Installation</SelectItem>
                              <SelectItem value="depannage">Dépannage</SelectItem>
                              {customTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                              <SelectItem value="custom" onClick={() => setShowCustomTypeInput(true)}>
                                + Ajouter un nouveau type
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {showCustomTypeInput && (
                            <div className="flex items-center mt-2 space-x-2">
                              <Input
                                value={customTypeInput}
                                onChange={(e) => setCustomTypeInput(e.target.value)}
                                placeholder="Nom du nouveau type"
                                className="flex-1"
                              />
                              <Button type="button" size="sm" onClick={addCustomType}>
                                Ajouter
                              </Button>
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setShowCustomTypeInput(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priorité</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une priorité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Basse</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="high">Haute</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="assigned_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technicien assigné</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un technicien" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Jean Martin">Jean Martin</SelectItem>
                          <SelectItem value="Sophie Dubois">Sophie Dubois</SelectItem>
                          <SelectItem value="Pierre Durand">Pierre Durand</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez l'intervention..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                  {isLoading ? "Création en cours..." : "Créer le ticket"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateTicket;
