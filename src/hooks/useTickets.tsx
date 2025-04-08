
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  priority: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  form_data: string | null;
  group_id: string | null;
}

// Define the type for Supabase ticket response with explicit properties
// to avoid deep type inference issues
interface SupabaseTicket {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  priority: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  form_data: string | null;
  group_id?: string | null;
}

export function useTickets() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Explicitly cast the data to SupabaseTicket[] to avoid type inference issues
    const typedData = data as SupabaseTicket[];
    
    // Map the data to ensure all required Ticket properties are included
    return (typedData || []).map((ticket) => ({
      ...ticket,
      group_id: ticket.group_id || null
    } as Ticket));
  };

  const fetchTicketsByGroupId = async (groupId: string): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Explicitly cast the data to SupabaseTicket[] to avoid type inference issues
    const typedData = data as SupabaseTicket[];
    
    // Map the data to ensure all required Ticket properties are included
    return (typedData || []).map((ticket) => ({
      ...ticket,
      group_id: ticket.group_id || null
    } as Ticket));
  };

  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
  });

  const getTicketById = async (id: string): Promise<Ticket | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Explicitly cast the data to SupabaseTicket to avoid type issues
      const typedData = data as SupabaseTicket;
      
      return {
        ...typedData,
        group_id: typedData.group_id || null
      } as Ticket;
    } catch (error) {
      setError(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketsByGroupId = async (groupId: string): Promise<Ticket[]> => {
    try {
      return await fetchTicketsByGroupId(groupId);
    } catch (error) {
      console.error('Error fetching tickets by group:', error);
      return [];
    }
  };

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: Partial<Ticket>): Promise<Ticket | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const user = supabase.auth.getUser();
        const userId = (await user).data.user?.id;

        if (!userId) {
          throw new Error("Utilisateur non connecté");
        }

        // Ensure title field is provided as it's required
        if (!ticket.title) {
          throw new Error("Le titre est requis");
        }

        // Ensure type field is provided as it's required
        if (!ticket.type) {
          ticket.type = "Non spécifié";
        }

        // Create insert object with required fields 
        const insertData: Record<string, any> = {
          created_by: userId,
          title: ticket.title,
          type: ticket.type,
          status: ticket.status || "Nouveau",
          description: ticket.description,
          priority: ticket.priority,
          assigned_to: ticket.assigned_to,
          form_data: ticket.form_data,
        };
        
        // Add group_id to insertData if it exists
        if (ticket.group_id) {
          insertData.group_id = ticket.group_id;
        }

        const { data, error } = await supabase
          .from('tickets')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        
        // Explicitly cast the data to SupabaseTicket to avoid type issues
        const typedData = data as SupabaseTicket;
        
        return {
          ...typedData,
          group_id: typedData.group_id || null
        } as Ticket;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, ticket }: { id: string; ticket: Partial<Ticket> }): Promise<Ticket | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('tickets')
          .update(ticket)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Ticket;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const { error } = await supabase
          .from('tickets')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      return await createTicketMutation.mutateAsync(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  };

  const updateTicket = async (id: string, ticket: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      return await updateTicketMutation.mutateAsync({ id, ticket });
    } catch (error) {
      console.error('Error updating ticket:', error);
      return null;
    }
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    try {
      await deleteTicketMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      return false;
    }
  };

  const getTickets = async (): Promise<Ticket[]> => {
    try {
      return await fetchTickets();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
  };

  return {
    tickets,
    getTickets,
    getTicketById,
    getTicketsByGroupId,
    createTicket,
    updateTicket,
    deleteTicket,
    isLoading: isLoading || isLoadingTickets,
    error,
  };
}
