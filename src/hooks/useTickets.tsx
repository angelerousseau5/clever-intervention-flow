
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  priority?: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  form_data?: string; // Added form_data property to fix TypeScript error
}

export const useTickets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getTickets = async (): Promise<Ticket[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        console.log("Utilisateur non connecté");
        return [];
      }

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des tickets:", error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les tickets. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la récupération des tickets:", errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user && !id) return null;

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du ticket:", error);
        setError(error.message);
        return null;
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (ticketData: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) return null;

      // Vérification des champs requis
      if (!ticketData.title || !ticketData.type) {
        const missingFields = [];
        if (!ticketData.title) missingFields.push("titre");
        if (!ticketData.type) missingFields.push("type");
        
        const errorMsg = `Champs requis manquants: ${missingFields.join(", ")}`;
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive",
        });
        setError(errorMsg);
        return null;
      }

      // Préparer les données à insérer avec les champs requis explicitement définis
      const newTicket = {
        title: ticketData.title,
        type: ticketData.type,
        created_by: user.id,
        status: ticketData.status || "En attente",
        description: ticketData.description || null,
        priority: ticketData.priority,
        assigned_to: ticketData.assigned_to || null,
        form_data: ticketData.form_data || null
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(newTicket)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création du ticket:", error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de créer le ticket. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Succès",
        description: "Le ticket a été créé avec succès",
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (id: string, ticketData: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('tickets')
        .update({
          ...ticketData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du ticket:", error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le ticket. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Succès",
        description: "Le ticket a été mis à jour avec succès",
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) return false;

      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erreur lors de la suppression du ticket:", error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le ticket. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Le ticket a été supprimé avec succès",
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};
