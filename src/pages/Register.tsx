
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { signUp, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    await signUp(formData.email, formData.password, formData.companyName);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto mt-16 px-4 sm:px-6">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary">
              Inscription Entreprise
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Créez votre espace pour gérer vos interventions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer un compte"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
