
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto mt-16 px-4 sm:px-6">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Accédez à votre espace entreprise
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
