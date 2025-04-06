
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
import { useTickets, Ticket } from "@/hooks/useTickets";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, X, Trash2, PlusCircle, Move, ArrowUp, ArrowDown, Save, Edit } from "lucide-react";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CustomFormFields } from "@/components/intervention/CustomFormFields";
import { SubmitFormSection } from "@/components/intervention/SubmitFormSection";

const baseSchema = {
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.string().default("En attente"),
  type: z.string().min(1, "Le type est requis"),
};

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
  const { createTicket, updateTicket, getTicketById, isLoading } = useTickets();
  const navigate = useNavigate();
  const location = useLocation();
  const [customTypeInput, setCustomTypeInput] = useState("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [fieldConfig, setFieldConfig] = useState<FieldConfigItem[]>([
    { id: "type", enabled: true, label: "Type", originalName: "type" },
    { id: "priority", enabled: true, label: "Priorité", originalName: "priority" },
    { id: "assigned_to", enabled: true, label: "Technicien assigné", originalName: "assigned_to" },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId) {
      setIsEditing(true);
      setCurrentTicketId(editId);
      loadTicketData(editId);
    }
  }, [location]);

  const loadTicketData = async (id: string) => {
    const ticket = await getTicketById(id);
    
    if (ticket) {
      // Mettre à jour le formulaire avec les valeurs du ticket
      const formDefaultValues: any = {
        title: ticket.title,
        description: ticket.description || "",
        status: ticket.status,
        type: ticket.type,
      };
      
      // N'ajouter les champs optionnels que s'ils existent dans le ticket
      if (ticket.priority) {
        formDefaultValues.priority = ticket.priority;
      }
      
      if (ticket.assigned_to) {
        formDefaultValues.assigned_to = ticket.assigned_to;
      }
      
      form.reset(formDefaultValues);
      
      // Charger les champs personnalisés s'ils existent
      if (ticket.form_data) {
        try {
          const formData = JSON.parse(ticket.form_data);
          if (formData.customFields) {
            setCustomFields(formData.customFields);
          }
          if (formData.values) {
            setFormValues(formData.values);
          }
          if (formData.submitted) {
            setFormSubmitted(formData.submitted);
          }
        } catch (e) {
          console.error("Error parsing form data:", e);
        }
      }
    }
  };

  // Cette fonction construit dynamiquement le schéma Zod
  const buildFormSchema = () => {
    let schemaObj: Record<string, any> = {};
    
    // Garantir que les champs de base sont toujours inclus
    schemaObj.title = z.string().min(2, "Le titre doit contenir au moins 2 caractères");
    schemaObj.description = z.string().min(10, "La description doit contenir au moins 10 caractères");
    schemaObj.status = z.string().default("En attente");
    schemaObj.type = z.string().min(1, "Le type est requis");
    
    // Ajouter les champs configurables s'ils sont activés
    fieldConfig.forEach(field => {
      if (field.enabled && field.originalName !== "type") {
        // Les champs priority et assigned_to sont optionnels
        schemaObj[field.originalName] = z.string().optional();
      }
    });
    
    return z.object(schemaObj);
  };

  // Construire le schéma dynamiquement
  const formSchema = buildFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "En attente",
      type: "",
    },
  });

  // Mettre à jour le formulaire quand la configuration des champs change
  useEffect(() => {
    // Récupérer les valeurs actuelles pour les conserver lors de la réinitialisation
    const currentValues = form.getValues();
    form.reset(currentValues);
  }, [fieldConfig]);

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (values: FormValues) => {
    // Vérifier les champs obligatoires
    if (!values.title || !values.type) {
      toast({
        title: "Erreur",
        description: "Le titre et le type sont requis",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Préparer les données du formulaire avec les champs personnalisés
      const formData = {
        customFields,
        values: formValues,
        submitted: false
      };
      
      // Créer un objet avec uniquement les champs activés dans fieldConfig
      const ticketData: Partial<Ticket> = {
        title: values.title,
        description: values.description,
        status: values.status,
        type: values.type,
        form_data: JSON.stringify(formData)
      };
      
      // N'ajouter les champs optionnels que s'ils sont activés et ont une valeur
      fieldConfig.forEach(field => {
        if (field.enabled && field.originalName !== "type") {
          const fieldValue = values[field.originalName as keyof FormValues];
          if (fieldValue) {
            // @ts-ignore - Nous savons que ces champs existent dans values si enabled est true
            ticketData[field.originalName] = fieldValue;
          } else {
            // S'assurer que les champs sans valeur sont à null
            // @ts-ignore
            ticketData[field.originalName] = null;
          }
        }
      });
      
      console.log("Données à soumettre:", ticketData);
      
      let result: Ticket | null;
      
      // Créer ou mettre à jour le ticket
      if (isEditing && currentTicketId) {
        result = await updateTicket(currentTicketId, ticketData);
      } else {
        result = await createTicket(ticketData);
      }
      
      if (result) {
        navigate("/dashboard/interventions");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire",
        variant: "destructive",
      });
    }
  };

  const addCustomType = () => {
    if (customTypeInput.trim()) {
      setCustomTypes([...customTypes, customTypeInput.trim()]);
      setCustomTypeInput("");
      setShowCustomTypeInput(false);
    }
  };

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

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const toggleField = (id: string) => {
    setFieldConfig(
      fieldConfig.map(field => 
        field.id === id 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

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

  const moveFieldUp = (index: number) => {
    if (index <= 0) return;
    const newFields = [...customFields];
    [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    setCustomFields(newFields);
  };

  const moveFieldDown = (index: number) => {
    if (index >= customFields.length - 1) return;
    const newFields = [...customFields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    setCustomFields(newFields);
  };

  const toggleRequired = (id: string) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id 
          ? { ...field, required: !field.required }
          : field
      )
    );
  };
  
  const updateFieldOptions = (id: string, options: string[]) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id 
          ? { ...field, options }
          : field
      )
    );
  };
  
  const addOptionToField = (id: string, option: string) => {
    if (!option.trim()) return;
    
    setCustomFields(
      customFields.map(field => {
        if (field.id === id && field.type === 'select') {
          const currentOptions = field.options || [];
          return { 
            ...field, 
            options: [...currentOptions, option.trim()] 
          };
        }
        return field;
      })
    );
  };
  
  const removeOptionFromField = (id: string, optionIndex: number) => {
    setCustomFields(
      customFields.map(field => {
        if (field.id === id && field.type === 'select' && field.options) {
          return { 
            ...field, 
            options: field.options.filter((_, index) => index !== optionIndex) 
          };
        }
        return field;
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Modifier le Ticket" : "Nouveau Ticket"}
          </h1>
          <Button variant="outline" onClick={() => addCustomField('input')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un champ
          </Button>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
          <ResizablePanel defaultSize={70}>
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Modification du ticket" : "Informations du ticket"}</CardTitle>
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
                              <Select onValueChange={field.onChange} value={field.value || ""}>
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
                            <Select onValueChange={field.onChange} value={field.value || ""}>
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

                    {/* Intégration du composant CustomFormFields */}
                    {customFields.length > 0 && (
                      <div className="mt-6 border-t pt-6">
                        <CustomFormFields 
                          customFields={customFields}
                          formValues={formValues}
                          handleInputChange={handleInputChange}
                          formSubmitted={formSubmitted}
                        />
                      </div>
                    )}

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
                      {isLoading ? "Traitement en cours..." : isEditing ? (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer les modifications
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Créer le ticket
                        </>
                      )}
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
                    <h3 className="text-sm font-medium">Ajouter des champs pour le technicien</h3>
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
                      <h3 className="text-sm font-medium mb-2">Configuration des champs</h3>
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
                          
                          {field.type === 'select' && (
                            <div className="mt-3">
                              <Label className="text-sm font-medium">Options:</Label>
                              <div className="mt-1 space-y-2">
                                {field.options?.map((option, index) => (
                                  <div key={index} className="flex items-center">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(field.options || [])];
                                        newOptions[index] = e.target.value;
                                        updateFieldOptions(field.id, newOptions);
                                      }}
                                      className="flex-1 h-7 text-sm"
                                    />
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeOptionFromField(field.id, index)}
                                      className="ml-1"
                                    >
                                      <X className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                                
                                <div className="flex items-center mt-1">
                                  <Input
                                    placeholder="Nouvelle option..."
                                    className="flex-1 h-7 text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.currentTarget;
                                        if (input.value) {
                                          addOptionToField(field.id, input.value);
                                          input.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    className="ml-1"
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                                      if (input && input.value) {
                                        addOptionToField(field.id, input.value);
                                        input.value = '';
                                      }
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
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
