
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const InterventionAccess = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    ticketNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual validation and form retrieval
    console.log("Accessing form with:", formData);
    
    // Simulate API call with failure for demo
    setTimeout(() => {
      setIsLoading(false);
      
      // Example of form not found notification
      toast({
        title: "Formulaire non trouvé",
        description: "Veuillez vérifier les informations saisies.",
        variant: "destructive",
      });
      
      // In a real application, on success we would redirect to the form
      // window.location.href = `/intervention-form/${formData.ticketNumber}`;
    }, 1000);
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
                placeholder="INT-12345"
                required
              />
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
