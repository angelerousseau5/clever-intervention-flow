
import { Calendar, CheckCircle, Users } from "lucide-react";

const features = [
  {
    name: "Gestion Simplifiée",
    description:
      "Créez et gérez facilement vos tickets d'intervention avec une interface intuitive.",
    icon: CheckCircle,
  },
  {
    name: "Suivi en Temps Réel",
    description:
      "Suivez l'état de vos interventions et recevez des notifications en temps réel.",
    icon: Calendar,
  },
  {
    name: "Collaboration Efficace",
    description:
      "Facilitez la communication entre les techniciens et les entreprises.",
    icon: Users,
  },
];

export const Features = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary">
            Pourquoi Choisir Notre Solution ?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative p-6 bg-accent rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-primary mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
