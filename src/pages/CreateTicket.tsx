
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTickets } from "@/hooks/useTickets";
import { useNavigate } from "react-router-dom";
import { Plus, X, Trash2, PlusCircle, Move, ArrowUp, ArrowDown } from "lucide-react";
import { 
  DraggableFieldContainer, 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Schéma de validation du formulaire de base
const baseSchema = {
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.string().default("En attente"),
};

// Interface pour les champs personnalisés
interface CustomField {
  id: string;
  type: 'select' | 'input' | 'textarea';
  name: string; 
  label: string;
  required: boolean;
  options?: string[]; // Pour les champs select
  defaultValue?: string;
}

type FieldConfigItem = {
  id: string;
  enabled: boolean;
  label: string;
  originalName: string;
};

const CreateTicket = () => {
  const { createTicket, isLoading } = useTickets();
  const navigate = useNavigate();
  const [customTypeInput, setCustomTypeInput] = useState("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  
  // État pour les champs personnalisés
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  
  // Configuration des champs prédéfinis
  const [fieldConfig, setFieldConfig] = useState<FieldConfigItem[]>([
    { id: "type", enabled: true, label: "Type", originalName: "type" },
    { id: "priority", enabled: true, label: "Priorité", originalName: "priority" },
    { id: "assigned_to", enabled: true, label: "Technicien assigné", originalName: "assigned_to" },
  ]);

  // Construction dynamique du schéma de validation
  const buildFormSchema = () => {
    let schemaObj = { ...baseSchema };
    
    // Ajouter les champs prédéfinis activés
    fieldConfig.forEach(field => {
      if (field.enabled) {
        if (field.originalName === "type" || field.originalName === "priority") {
          schemaObj[field.originalName] = z.string().min(1, `Veuillez sélectionner un ${field.label.toLowerCase()}`);
        } else if (field.originalName === "assigned_to") {
          schemaObj[field.originalName] = z.string().optional();
        }
      }
    });
    
    // Ajouter les champs personnalisés
    customFields.forEach(field => {
      if (field.required) {
        schemaObj[field.name] = z.string().min(1, `Le champ ${field.label} est requis`);
      } else {
        schemaObj[field.name] = z.string().optional();
      }
    });
    
    return z.object(schemaObj);
  };

  const formSchema = buildFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "En attente",
      ...(fieldConfig.find(f => f.id === "type" && f.enabled) ? { type: "" } : {}),
      ...(fieldConfig.find(f => f.id === "priority" && f.enabled) ? { priority: "" } : {}),
      ...(fieldConfig.find(f => f.id === "assigned_to" && f.enabled) ? { assigned_to: "" } : {}),
    },
  });

  // Mise à jour du formulaire lorsque les champs changent
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      ...(fieldConfig.find(f => f.id === "type" && f.enabled) ? {} : { type: undefined }),
      ...(fieldConfig.find(f => f.id === "priority" && f.enabled) ? {} : { priority: undefined }),
      ...(fieldConfig.find(f => f.id === "assigned_to" && f.enabled) ? {} : { assigned_to: undefined }),
    });
  }, [fieldConfig]);

  const onSubmit = async (values: FormValues) => {
    const ticket = await createTicket(values);
    
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

  // Ajouter un champ personnalisé
  const addCustomField = (type: 'select' | 'input' | 'textarea') => {
    const newId = `custom_${Date.now()}`;
    const newName = `custom_field_${customFields.length + 1}`;
    
    const newField: CustomField = {
      id: newId,
      type,
      name: newName,
      label: `Champ personnalisé ${customFields.length + 1}`,
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    
    setCustomFields([...customFields, newField]);
  };

  // Supprimer un champ personnalisé
  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  // Toggle pour activer/désactiver un champ prédéfini
  const toggleField = (id: string) => {
    setFieldConfig(
      fieldConfig.map(field => 
        field.id === id 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  // Modifier le label d'un champ
  const updateFieldLabel = (id: string, value: string) => {
    if (id.startsWith('custom_')) {
      setCustomFields(
        customFields.map(field => 
          field.id === id 
            ? { ...field, label: value }
            : field
        )
      );
    } else {
      setFieldConfig(
        fieldConfig.map(field => 
          field.id === id 
            ? { ...field, label: value }
            : field
        )
      );
    }
  };

  // Déplacer un champ vers le haut
  const moveFieldUp = (index: number) => {
    if (index <= 0) return;
    const newFields = [...customFields];
    [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    setCustomFields(newFields);
  };

  // Déplacer un champ vers le bas
  const moveFieldDown = (index: number) => {
    if (index >= customFields.length - 1) return;
    const newFields = [...customFields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    setCustomFields(newFields);
  };

  // Rendre un champ requis ou non
  const toggleRequired = (id: string) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id 
          ? { ...field, required: !field.required }
          : field
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nouveau Ticket</h1>
          <Button variant="outline" onClick={() => addCustomField('input')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un champ
          </Button>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
          <ResizablePanel defaultSize={70}>
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
                      {fieldConfig.find(f => f.id === "type" && f.enabled) && (
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{fieldConfig.find(f => f.id === "type")?.label}</FormLabel>
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
                      )}

                      {fieldConfig.find(f => f.id === "priority" && f.enabled) && (
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{fieldConfig.find(f => f.id === "priority")?.label}</FormLabel>
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
                      )}
                    </div>

                    {fieldConfig.find(f => f.id === "assigned_to" && f.enabled) && (
                      <FormField
                        control={form.control}
                        name="assigned_to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{fieldConfig.find(f => f.id === "assigned_to")?.label}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un technicien" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="undefined">À définir</SelectItem>
                                <SelectItem value="Jean Martin">Jean Martin</SelectItem>
                                <SelectItem value="Sophie Dubois">Sophie Dubois</SelectItem>
                                <SelectItem value="Pierre Durand">Pierre Durand</SelectItem>
                                <SelectItem value="self">Moi-même</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Champs personnalisés */}
                    {customFields.map((field, index) => (
                      <DraggableFieldContainer 
                        key={field.id}
                        onMoveUp={index > 0 ? () => moveFieldUp(index) : undefined}
                        onMoveDown={index < customFields.length - 1 ? () => moveFieldDown(index) : undefined}
                      >
                        <FormField
                          control={form.control}
                          name={field.name as any}
                          render={({ field: formField }) => (
                            <FormItem>
                              <div className="flex justify-between items-center mb-2">
                                <FormLabel>{field.label}</FormLabel>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeCustomField(field.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <FormControl>
                                {field.type === 'input' && (
                                  <Input 
                                    {...formField} 
                                    placeholder={`Entrez ${field.label.toLowerCase()}`} 
                                  />
                                )}
                                {field.type === 'textarea' && (
                                  <Textarea 
                                    {...formField} 
                                    placeholder={`Entrez ${field.label.toLowerCase()}`} 
                                  />
                                )}
                                {field.type === 'select' && (
                                  <Select 
                                    onValueChange={formField.onChange} 
                                    value={formField.value}
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
                              </FormControl>
                              <div className="flex items-center mt-2 text-sm">
                                <Switch 
                                  id={`required-${field.id}`}
                                  checked={field.required}
                                  onCheckedChange={() => toggleRequired(field.id)}
                                  className="mr-2"
                                />
                                <Label htmlFor={`required-${field.id}`}>Champ requis</Label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </DraggableFieldContainer>
                    ))}

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
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30}>
            <Card>
              <CardHeader>
                <CardTitle>Configuration des champs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Champs prédéfinis</h3>
                  
                  {fieldConfig.map(field => (
                    <div key={field.id} className="flex flex-col space-y-2 p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`toggle-${field.id}`}
                            checked={field.enabled}
                            onCheckedChange={() => toggleField(field.id)}
                          />
                          <Label htmlFor={`toggle-${field.id}`}>{field.label}</Label>
                        </div>
                      </div>
                      
                      {field.enabled && (
                        <div className="flex items-center mt-2">
                          <Label className="w-20 text-sm">Libellé:</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                            className="flex-1 h-8 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Ajouter des champs</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addCustomField('input')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Texte
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addCustomField('textarea')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Zone de texte
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addCustomField('select')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Liste déroulante
                    </Button>
                  </div>
                  
                  {customFields.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Champs personnalisés</h3>
                      {customFields.map((field, index) => (
                        <div key={field.id} className="border rounded-md p-3 mb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Move className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{field.label}</span>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeCustomField(field.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-2">
                            <Label className="w-20 text-sm">Libellé:</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                              className="flex-1 h-8 text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center mt-2">
                            <Switch 
                              id={`config-required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={() => toggleRequired(field.id)}
                              className="mr-2"
                            />
                            <Label htmlFor={`config-required-${field.id}`}>Champ requis</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DashboardLayout>
  );
};

export default CreateTicket;
