
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, FileText, Clock } from "lucide-react";

export const AppDescription = () => {
  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            InterFlow : La Solution Complète de Gestion des Interventions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une plateforme tout-en-un pour gérer, suivre et optimiser les interventions techniques de votre entreprise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-secondary">
              Fonctionnalités Principales
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Création de tickets</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Créez facilement des tickets d'intervention avec toutes les informations nécessaires et des champs personnalisables selon vos besoins.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Formulaires adaptés</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Générez des formulaires d'intervention adaptés à chaque type de ticket, accessibles par vos clients ou techniciens via un lien unique.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Suivi en temps réel</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Suivez l'état de vos interventions en temps réel avec des mises à jour instantanées et des notifications personnalisables.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Rapports et exports PDF</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Générez des rapports détaillés de vos interventions et exportez-les en PDF pour vos clients ou votre archivage.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Tableau de bord analytique</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Visualisez les performances de votre service technique avec un tableau de bord complet et des indicateurs clés.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-secondary">
              Avantages Clés
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Interface intuitive</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Une interface moderne et facile à utiliser, accessible sur tous vos appareils, pour une expérience utilisateur optimale.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Sécurité avancée</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Protégez vos données avec une authentification sécurisée et des contrôles d'accès granulaires pour chaque utilisateur.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Personnalisation complète</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Adaptez l'application à vos processus spécifiques avec des champs, des statuts et des workflows personnalisables.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Intégration transparente</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Intégrez facilement InterFlow avec vos outils existants grâce à notre API ouverte et nos connecteurs prédéfinis.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <span className="font-medium">Support réactif</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Bénéficiez d'un support technique dédié et d'une documentation complète pour vous accompagner à chaque étape.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Témoignage Client */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-16">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ce que nos clients disent</h3>
              <blockquote className="italic text-gray-600 border-l-4 border-primary pl-4 mb-4">
                "InterFlow a révolutionné notre gestion des interventions techniques. Nous avons réduit de 40% le temps de traitement des tickets et amélioré la satisfaction de nos clients de manière significative. L'interface intuitive permet à nos techniciens de se concentrer sur leur travail plutôt que sur l'administration."
              </blockquote>
              <p className="font-medium">Jean Dupont, Directeur Technique - TechServices SAS</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-primary/10 rounded-full p-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2">15,000+</h3>
              <p className="text-gray-600 text-center">Interventions gérées mensuellement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-primary/10 rounded-full p-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-gray-600 text-center">Entreprises nous font confiance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-primary/10 rounded-full p-3 mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2">-45%</h3>
              <p className="text-gray-600 text-center">Réduction du temps de traitement</p>
            </CardContent>
          </Card>
        </div>

        {/* Comment ça marche */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-8">Comment fonctionne InterFlow ?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-secondary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Créez un ticket</h4>
              <p className="text-gray-600 text-sm">Définissez le type d'intervention et renseignez les informations nécessaires.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-secondary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h4 className="font-semibold mb-2">Partagez le formulaire</h4>
              <p className="text-gray-600 text-sm">Envoyez le lien au client ou technicien pour qu'il remplisse le formulaire d'intervention.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-secondary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Suivez l'avancement</h4>
              <p className="text-gray-600 text-sm">Visualisez le statut des interventions en temps réel sur votre tableau de bord.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-secondary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary">4</span>
              </div>
              <h4 className="font-semibold mb-2">Générez des rapports</h4>
              <p className="text-gray-600 text-sm">Exportez les données en PDF et analysez les performances de votre service.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Prêt à optimiser la gestion de vos interventions ?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition-colors">
              Créer un compte
            </a>
            <a href="/intervention" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Essayer le formulaire d'intervention
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
