import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';


export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: string;
  owner_id: string;
  collaborators: any[];
  tags: string[];
  image_url: string | null;
}

export interface NewProjectPayload {
  title: string;
  description?: string;
  status?: string;
  tags?: string[];
  image_url?: string;
}

interface UseProjectsOptions {
  ownerOnly?: boolean;
  ownerId?: string;
  status?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error?: string;
  createProject: (payload: NewProjectPayload) => Promise<void>;
  updateProject: (id: string, payload: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

/**
 * Hook for realtime projects with filtering options
 * @param options - Filter options for projects
 */
export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { ownerOnly = false, ownerId, status } = options;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  // Channel reference is kept in the effect closure, no need for state if not exposed


  // Fetch initial projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(undefined);

        let query = supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters
        if (ownerOnly && ownerId) {
          query = query.eq('owner_id', ownerId);
        }

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setProjects(data || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [ownerOnly, ownerId, status]);

  // Subscribe to realtime changes
  useEffect(() => {
    const channelName = `projects:${ownerOnly ? ownerId || 'user' : 'all'}`;

    const projectChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('New project created:', payload);
          const newProject = payload.new as Project;

          // Check if this project matches our filters
          const matchesOwner = !ownerOnly || newProject.owner_id === ownerId;
          const matchesStatus = !status || newProject.status === status;

          if (matchesOwner && matchesStatus) {
            setProjects((prev) => [newProject, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('Project updated:', payload);
          const updatedProject = payload.new as Project;

          setProjects((prev) => {
            // Check if project still matches filters
            const matchesOwner = !ownerOnly || updatedProject.owner_id === ownerId;
            const matchesStatus = !status || updatedProject.status === status;

            if (matchesOwner && matchesStatus) {
              // Update if exists, add if new to this view
              const exists = prev.some((p) => p.id === updatedProject.id);
              if (exists) {
                return prev.map((p) =>
                  p.id === updatedProject.id ? updatedProject : p
                );
              } else {
                return [updatedProject, ...prev];
              }
            } else {
              // Remove if no longer matches filters
              return prev.filter((p) => p.id !== updatedProject.id);
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('Project deleted:', payload);
          setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();



    // Cleanup subscription on unmount
    return () => {
      console.log('Unsubscribing from projects channel');
      projectChannel.unsubscribe();
    };
  }, [ownerOnly, ownerId, status]);

  // Create a new project
  const createProject = useCallback(
    async (payload: NewProjectPayload) => {
      if (!ownerId) {
        throw new Error('User ID required to create project');
      }

      try {
        const { error: createError } = await supabase.from('projects').insert({
          title: payload.title,
          description: payload.description || null,
          status: payload.status || 'active',
          owner_id: ownerId,
          collaborators: [],
          tags: payload.tags || [],
          image_url: payload.image_url || null,
        });

        if (createError) throw createError;
      } catch (err: any) {
        console.error('Error creating project:', err);
        setError(err.message);
        throw err;
      }
    },
    [ownerId]
  );

  // Update an existing project
  const updateProject = useCallback(
    async (id: string, payload: Partial<Project>) => {
      try {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (updateError) throw updateError;
      } catch (err: any) {
        console.error('Error updating project:', err);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
