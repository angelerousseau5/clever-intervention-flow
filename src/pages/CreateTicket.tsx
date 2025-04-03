
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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Enhanced schema that allows for custom fields
const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  type: z.string().optional(), // Now optional
  priority: z.string(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  technicien: z.string(),
  customFields: z.record(z.string()).optional(), // For additional custom fields
});

type CustomField = {
  id: string;
  name: string;
  value: string;
};

const CreateTicket = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customTypeInput, setCustomTypeInput] = useState("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      priority: "",
      description: "",
      technicien: "",
      customFields: {},
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Convert custom fields array to record for submission
    const customFieldsRecord: Record<string, string> = {};
    customFields.forEach(field => {
      customFieldsRecord[field.name] = field.value;
    });
    
    const submissionData = {
      ...values,
      customFields: customFieldsRecord,
    };
    
    console.log(submissionData);
    toast({
      title: "Ticket créé",
      description: "Le ticket a été créé avec succès",
    });
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: `field-${Date.now()}`, name: "", value: "" },
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, key: "name" | "value", value: string) => {
    setCustomFields(
      customFields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
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
          <Plus className="h-6 w-6 text-gray-500" />
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
                        <Select onValueChange={field.onChange}>
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
                  name="technicien"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technicien assigné</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un technicien" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jean">Jean Martin</SelectItem>
                          <SelectItem value="sophie">Sophie Dubois</SelectItem>
                          <SelectItem value="pierre">Pierre Durand</SelectItem>
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
                
                {/* Custom Fields Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Champs supplémentaires</h3>
                    <Button 
                      type="button" 
                      onClick={addCustomField} 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter un champ
                    </Button>
                  </div>
                  
                  {customFields.map((field) => (
                    <div key={field.id} className="flex flex-col space-y-2 p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Champ personnalisé</h4>
                        <Button 
                          type="button" 
                          onClick={() => removeCustomField(field.id)} 
                          variant="ghost"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <FormLabel className="text-xs">Nom du champ</FormLabel>
                          <Input
                            value={field.name}
                            onChange={(e) => updateCustomField(field.id, "name", e.target.value)}
                            placeholder="Nom du champ"
                          />
                        </div>
                        <div className="space-y-2">
                          <FormLabel className="text-xs">Valeur</FormLabel>
                          <Input
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, "value", e.target.value)}
                            placeholder="Valeur"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full md:w-auto">
                  Créer le ticket
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
