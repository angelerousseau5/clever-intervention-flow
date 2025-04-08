
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const InterventionAccess = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    ticketNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Si le code saisi contient moins de 36 caractères (UUID complet), 
      // on recherche les tickets dont l'ID commence par ce code
      const searchValue = formData.ticketNumber.trim();
      
      let query = supabase.from('tickets').select('*');
      
      // Si nous avons un UUID complet (36 caractères)
      if (searchValue.length === 36) {
        query = query.eq('id', searchValue);
      } 
      // Si nous avons les 8 premiers caractères ou plus
      else if (searchValue.length >= 8) {
        // Utilisation d'une requête ILIKE avec le préfixe du ticket
        query = query.ilike('id', `${searchValue}%`);
      } else {
        toast({
          title: "Format invalide",
          description: "Veuillez saisir au moins 8 caractères du numéro de ticket.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const { data: tickets, error } = await query;
      
      if (error || !tickets || tickets.length === 0) {
        toast({
          title: "Formulaire non trouvé",
          description: "Veuillez vérifier le numéro de ticket saisi.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Si plusieurs tickets correspondent, prendre le premier
      const ticket = tickets[0];
      
      // Success - store access info and redirect to view form
      localStorage.setItem('interventionAccess', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        ticketId: ticket.id,
        accessedAt: new Date().toISOString()
      }));
      
      // Update ticket status to "En cours" if it's not already completed
      if (ticket.status !== "Terminé") {
        await supabase
          .from('tickets')
          .update({ 
            status: "En cours",
            updated_at: new Date().toISOString()
          })
          .eq('id', ticket.id);
      }
      
      navigate(`/intervention-form/${ticket.id}`);
    } catch (error) {
      console.error("Erreur lors de la vérification du ticket:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto mt-16 px-4 sm:px-6">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary">
              Accès au Formulaire d'Intervention
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez saisir vos informations pour accéder au formulaire d'intervention
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Entreprise SAS"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketNumber">Numéro du ticket</Label>
              <Input
                id="ticketNumber"
                name="ticketNumber"
                value={formData.ticketNumber}
                onChange={handleChange}
                placeholder="878f9259"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Entrez au moins les 8 premiers caractères de l'identifiant du ticket
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Recherche en cours..." : "Accéder au formulaire"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterventionAccess;
