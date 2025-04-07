
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, Users, Shield, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AppDescription = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Présentation Complète d'InterFlow
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez comment notre plateforme révolutionne la gestion des interventions techniques
            et optimise la collaboration entre les différents intervenants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Gestion Simplifiée des Interventions
            </h3>
            <ul className="space-y-4">
              {[
                "Création et suivi des interventions techniques en temps réel",
                "Formulaires personnalisables selon vos besoins spécifiques",
                "Assignation des interventions aux techniciens disponibles",
                "Tableaux de bord intuitifs pour une vision globale"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-medium text-secondary mb-2">Accès Client Simplifié</h4>
              <p className="text-gray-600 mb-4">
                Vos clients accèdent à leurs formulaires d'intervention sans inscription préalable, 
                via un système sécurisé d'identification par e-mail.
              </p>
              <Link to="/intervention">
                <Button variant="outline" size="sm">
                  Tester l'accès client
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative p-6 bg-accent rounded-lg overflow-hidden">
            <div className="relative z-10">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-3">
                Formulaires Intelligents
              </h3>
              <p className="text-gray-700 mb-4">
                Nos formulaires d'intervention sont entièrement personnalisables avec différents 
                types de champs (texte, sélection, zone de texte) et peuvent être préremplis avec 
                des informations existantes.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Export PDF automatique</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Validation des données</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Signatures électroniques</span>
                </li>
              </ul>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <FileText className="h-48 w-48 text-primary" />
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-3">
                Collaboration Efficace
              </h3>
              <p className="text-gray-600">
                Facilitez la communication entre vos équipes techniques et vos clients avec un 
                système centralisé où toutes les informations sont accessibles en temps réel.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-3">
                Sécurité Renforcée
              </h3>
              <p className="text-gray-600">
                Protégez vos données sensibles avec notre système d'authentification 
                avancé et nos contrôles d'accès granulaires pour chaque intervention.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Calendar className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-3">
                Suivi Chronologique
              </h3>
              <p className="text-gray-600">
                Gardez une trace complète de toutes les actions effectuées sur chaque 
                intervention avec horodatage et identification des intervenants.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h3 className="text-2xl font-bold text-secondary mb-2">
                  Prêt à Optimiser vos Interventions ?
                </h3>
                <p className="text-gray-700">
                  Rejoignez les entreprises qui ont déjà simplifié leur processus de gestion des interventions.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link to="/register">
                  <Button className="gap-2">
                    Créer un Compte
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">
                    Se Connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-secondary text-center mb-10">
            Le Cycle Complet de Gestion des Interventions
          </h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Création du ticket",
                  description: "Créez un ticket d'intervention avec tous les détails nécessaires",
                  icon: FileText
                },
                {
                  step: 2,
                  title: "Personnalisation du formulaire",
                  description: "Ajoutez des champs spécifiques selon le type d'intervention",
                  icon: FileText
                },
                {
                  step: 3,
                  title: "Intervention sur site",
                  description: "Le technicien remplit le formulaire lors de son intervention",
                  icon: Users
                },
                {
                  step: 4,
                  title: "Validation et archivage",
                  description: "L'intervention est validée et archivée pour référence future",
                  icon: Check
                }
              ].map((item, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-medium text-secondary mb-2">{item.title}</h4>
                  <p className="text-center text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <Activity className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-secondary mb-4">
            Statistiques en Temps Réel
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Suivez les performances de vos équipes et l'état de vos interventions grâce 
            à nos tableaux de bord analytiques avancés.
          </p>
          <div className="inline-block">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Découvrir la Plateforme
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
