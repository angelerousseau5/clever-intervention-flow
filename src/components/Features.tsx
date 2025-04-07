
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FileText, Users, BarChart, Clock, Shield } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Tickets d'intervention personnalisés",
      description:
        "Créez des formulaires adaptés à chaque type d'intervention avec des champs personnalisables pour collecter les informations pertinentes.",
    },
    {
      icon: CheckSquare,
      title: "Suivi simplifié",
      description:
        "Suivez l'état de vos interventions en temps réel et visualisez leur progression dans votre tableau de bord intuitif.",
    },
    {
      icon: Users,
      title: "Portail client dédié",
      description:
        "Offrez à vos clients un portail sécurisé pour accéder aux formulaires d'intervention et suivre l'avancement de leurs demandes.",
    },
    {
      icon: BarChart,
      title: "Rapports et analyses",
      description:
        "Générez des rapports détaillés sur les performances de votre service technique et identifiez les axes d'amélioration.",
    },
    {
      icon: Clock,
      title: "Gain de temps considérable",
      description:
        "Automatisez les tâches administratives et concentrez-vous sur ce qui compte vraiment : le service à vos clients.",
    },
    {
      icon: Shield,
      title: "Sécurité et conformité",
      description:
        "Vos données sont protégées par des protocoles de sécurité avancés et notre solution est conforme aux réglementations en vigueur.",
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            InterFlow propose une suite complète d'outils pour optimiser la gestion de vos interventions techniques de A à Z.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/40 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <feature.icon className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
