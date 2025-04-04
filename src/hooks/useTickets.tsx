
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
}

export const useTickets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getTickets = async (): Promise<Ticket[]> => {
    try {
      setIsLoading(true);
      if (!user) return [];

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des tickets:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les tickets",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erreur:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      if (!user) return null;

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du ticket:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erreur:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (ticketData: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      if (!user) return null;

      // Ensure required fields are present
      if (!ticketData.title || !ticketData.type) {
        toast({
          title: "Erreur",
          description: "Le titre et le type sont requis",
          variant: "destructive",
        });
        return null;
      }

      const newTicket = {
        ...ticketData,
        created_by: user.id,
        status: ticketData.status || "En attente",
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(newTicket)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création du ticket:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer le ticket",
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
      console.error("Erreur:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (id: string, ticketData: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      setIsLoading(true);
      if (!user) return null;

      const { data, error } = await supabase
        .from('tickets')
        .update(ticketData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du ticket:", error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le ticket",
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
      console.error("Erreur:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      if (!user) return false;

      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erreur lors de la suppression du ticket:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le ticket",
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
      console.error("Erreur:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};
