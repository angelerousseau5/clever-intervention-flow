
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-accent to-white py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-6">
            Gestion des Interventions
            <span className="text-primary"> Simplifiée</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Optimisez la gestion de vos interventions techniques avec notre
            plateforme intuitive. Créez, suivez et gérez vos tickets
            d'intervention en toute simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Commencer Maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/intervention">
              <Button size="lg" variant="outline">
                Nouvelle Intervention
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
