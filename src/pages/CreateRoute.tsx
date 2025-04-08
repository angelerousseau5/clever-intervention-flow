
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const CreateRoute = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'un délai de traitement
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard/route");
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard/route")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Créer une nouvelle route</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informations de la route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la route</Label>
                <Input id="name" placeholder="ex: Paris - Lyon" required />
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start">Point de départ</Label>
                  <Input id="start" placeholder="ex: Paris" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Point d'arrivée</Label>
                  <Input id="end" placeholder="ex: Lyon" required />
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input 
                    id="distance" 
                    type="number" 
                    placeholder="ex: 465" 
                    min="1" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée estimée (minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="ex: 270" 
                    min="1" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes additionnelles</Label>
                <Input id="notes" placeholder="Informations complémentaires" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/dashboard/route")}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateRoute;
