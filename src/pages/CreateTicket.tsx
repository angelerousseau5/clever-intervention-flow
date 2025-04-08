
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, X, Trash2, PlusCircle, Move, Save } from "lucide-react";
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
import { CustomField } from "@/types/formTypes";

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.string().default("En attente"),
  group_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTicket = () => {
  const { createTicket, updateTicket, getTicketById, isLoading } = useTickets();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    const group = params.get('group');
    
    if (group) {
      setGroupId(group);
    }
    
    if (editId) {
      setIsEditing(true);
      setCurrentTicketId(editId);
      loadTicketData(editId);
    }
  }, [location]);

  const loadTicketData = async (id: string) => {
    const ticket = await getTicketById(id);
    
    if (ticket) {
      const formDefaultValues: any = {
        title: ticket.title,
        description: ticket.description || "",
        status: ticket.status,
        group_id: ticket.group_id || "",
      };
      
      form.reset(formDefaultValues);
      
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "En attente",
      group_id: groupId,
    },
  });

  useEffect(() => {
    if (groupId) {
      form.setValue("group_id", groupId);
    }
  }, [groupId, form]);

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.title) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const formData = {
        customFields,
        values: formValues,
        submitted: false
      };
      
      const ticketData: Partial<Ticket> = {
        title: values.title,
        description: values.description,
        status: values.status,
        form_data: JSON.stringify(formData),
        group_id: values.group_id,
      };
      
      console.log("Données à soumettre:", ticketData);
      
      let result: Ticket | null;
      
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
    
    // Supprimer également les valeurs associées à ce champ
    const fieldToRemove = customFields.find(field => field.id === id);
    if (fieldToRemove) {
      const newFormValues = { ...formValues };
      delete newFormValues[fieldToRemove.name];
      setFormValues(newFormValues);
    }
  };

  const updateFieldLabel = (id: string, value: string) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id 
          ? { ...field, label: value }
          : field
      )
    );
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

                    {groupId && (
                      <FormField
                        control={form.control}
                        name="group_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Groupe</FormLabel>
                            <FormControl>
                              <Input readOnly {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

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
                  <h3 className="text-sm font-medium">Ajouter des champs pour le technicien</h3>
                  
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
