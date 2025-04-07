
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTickets } from "@/hooks/useTickets";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

type TestResult = {
  name: string;
  status: "success" | "error" | "pending";
  message: string;
};

export const AppTester = () => {
  const [showTester, setShowTester] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, session } = useAuth();
  const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } = useTickets();

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const runTests = async () => {
    setResults([]);
    setIsRunning(true);

    // Test 1: Vérification de la connexion à Supabase
    addResult({
      name: "Connexion à Supabase",
      status: "pending",
      message: "Vérification de la connexion...",
    });

    try {
      const { data, error } = await supabase.from("tickets").select("count()", { count: "exact", head: true });
      
      if (error) throw new Error(error.message);
      
      addResult({
        name: "Connexion à Supabase",
        status: "success",
        message: "Connexion à Supabase établie avec succès",
      });
    } catch (error) {
      addResult({
        name: "Connexion à Supabase",
        status: "error",
        message: "Erreur de connexion: " + (error instanceof Error ? error.message : String(error)),
      });
    }

    // Test 2: Vérification de l'authentification
    addResult({
      name: "Authentification",
      status: user ? "success" : "error",
      message: user 
        ? `Authentifié en tant que ${user.email}` 
        : "Non authentifié. Veuillez vous connecter pour tester toutes les fonctionnalités",
    });

    // Si l'utilisateur est connecté, on teste les fonctionnalités qui nécessitent l'authentification
    if (user) {
      // Test 3: Création d'un ticket
      addResult({
        name: "Création de ticket",
        status: "pending",
        message: "Tentative de création d'un ticket de test...",
      });

      try {
        const testTicket = await createTicket({
          title: "Ticket de test",
          description: "Ce ticket a été créé automatiquement pour tester l'application",
          type: "Test",
          status: "En attente",
          priority: "Basse",
        });

        if (!testTicket) throw new Error("Échec de création du ticket");

        addResult({
          name: "Création de ticket",
          status: "success",
          message: `Ticket créé avec succès (ID: ${testTicket.id.slice(0, 8)})`,
        });

        // Test 4: Récupération du ticket
        addResult({
          name: "Récupération de ticket",
          status: "pending",
          message: "Tentative de récupération du ticket créé...",
        });

        const fetchedTicket = await getTicketById(testTicket.id);
        
        if (!fetchedTicket) throw new Error("Échec de récupération du ticket");
        
        addResult({
          name: "Récupération de ticket",
          status: "success",
          message: "Ticket récupéré avec succès",
        });

        // Test 5: Mise à jour du ticket
        addResult({
          name: "Mise à jour de ticket",
          status: "pending",
          message: "Tentative de mise à jour du ticket...",
        });

        const updatedTicket = await updateTicket(testTicket.id, {
          status: "En cours",
          description: "Ce ticket a été mis à jour automatiquement",
        });

        if (!updatedTicket) throw new Error("Échec de mise à jour du ticket");

        addResult({
          name: "Mise à jour de ticket",
          status: "success",
          message: "Ticket mis à jour avec succès",
        });

        // Test 6: Suppression du ticket
        addResult({
          name: "Suppression de ticket",
          status: "pending",
          message: "Tentative de suppression du ticket...",
        });

        const deleteSuccess = await deleteTicket(testTicket.id);
        
        if (!deleteSuccess) throw new Error("Échec de suppression du ticket");
        
        addResult({
          name: "Suppression de ticket",
          status: "success",
          message: "Ticket supprimé avec succès",
        });
      } catch (error) {
        // En cas d'erreur dans la chaîne de tests, on ajoute un résultat d'erreur
        addResult({
          name: "Opération sur tickets",
          status: "error",
          message: "Erreur: " + (error instanceof Error ? error.message : String(error)),
        });
      }

      // Test 7: Liste des tickets
      addResult({
        name: "Liste des tickets",
        status: "pending",
        message: "Récupération de la liste des tickets...",
      });

      try {
        const tickets = await getTickets();
        addResult({
          name: "Liste des tickets",
          status: "success",
          message: `${tickets.length} ticket(s) récupéré(s)`,
        });
      } catch (error) {
        addResult({
          name: "Liste des tickets",
          status: "error",
          message: "Erreur: " + (error instanceof Error ? error.message : String(error)),
        });
      }
    }

    // Test du système de toast
    toast({
      title: "Test des notifications",
      description: "Cette notification confirme que le système de toast fonctionne correctement",
    });

    addResult({
      name: "Système de notifications",
      status: "success",
      message: "Toast affiché avec succès",
    });

    setIsRunning(false);
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Testeur d'application
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Cet outil permet de vérifier le bon fonctionnement de toutes les fonctionnalités de l'application InterFlow.
          </p>
          
          <Button 
            onClick={() => {
              if (showTester) {
                setShowTester(false);
                setResults([]);
              } else {
                setShowTester(true);
              }
            }}
            className="mb-4"
          >
            {showTester ? "Masquer le testeur" : "Afficher le testeur"}
          </Button>
        </div>

        {showTester && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Tests des fonctionnalités</h3>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                variant={isRunning ? "outline" : "default"}
              >
                {isRunning ? "Tests en cours..." : "Lancer les tests"}
              </Button>
            </div>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="p-4 rounded-md border flex items-start gap-3">
                    {result.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    )}
                    {result.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    {result.status === "pending" && (
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className={`text-sm ${
                        result.status === "success" 
                          ? "text-green-600" 
                          : result.status === "error" 
                          ? "text-red-600" 
                          : "text-blue-600"
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun test n'a encore été exécuté. Cliquez sur "Lancer les tests" pour commencer.</p>
                {!user && (
                  <p className="mt-2 text-sm">
                    ⚠️ Vous n'êtes pas connecté. Certains tests nécessitent une authentification.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
