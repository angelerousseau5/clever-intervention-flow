
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-slate-50 pt-20 pb-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Simplifiez vos <span className="text-primary">interventions techniques</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          InterFlow est une plateforme complète de gestion des interventions qui centralise, organise et optimise le travail de vos équipes techniques.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="text-md font-medium">
              Commencer maintenant
            </Button>
          </Link>
          <Link to="/intervention">
            <Button size="lg" variant="outline" className="text-md font-medium">
              Accéder à un formulaire
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
