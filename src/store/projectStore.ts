import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';
import { useAuthStore } from './authStore';
import { humanizeTextApi } from '../services/humanizerApi';

interface HumanizeOptions {
  humanizationStrength?: number;
  personality?: 'neutral' | 'friendly' | 'professional' | 'casual';
  lengthAdjustment?: 'maintain' | 'shorter' | 'longer';
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (title: string, content: string) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  humanizeText: (
    text: string, 
    mode?: 'standard' | 'casual' | 'academic' | 'creative',
    options?: HumanizeOptions
  ) => Promise<{ humanizedText: string; documentId?: string }>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = data.map(item => ({
        id: item.id,
        createdAt: item.created_at,
        userId: item.user_id,
        title: item.title,
        content: item.content,
        humanizedContent: item.humanized_content,
        creditsUsed: item.credits_used,
      }));

      set({ projects: formattedProjects });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (title: string, content: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return null;

    try {
      set({ loading: true, error: null });
      
      const newProject = {
        user_id: user.id,
        title,
        content,
        credits_used: 0,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      const formattedProject: Project = {
        id: data.id,
        createdAt: data.created_at,
        userId: data.user_id,
        title: data.title,
        content: data.content,
        humanizedContent: data.humanized_content,
        creditsUsed: data.credits_used,
      };

      set(state => ({ 
        projects: [formattedProject, ...state.projects],
        currentProject: formattedProject
      }));

      console.log('New project created:', formattedProject);
      
      return formattedProject;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      set({ loading: true, error: null });
      
      // Include all fields that exist in the database schema
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          content: updates.content,
          humanized_content: updates.humanizedContent,
          credits_used: updates.creditsUsed,
          mode: updates.mode,
          humanization_strength: updates.humanizationStrength,
          personality: updates.personality,
          length_adjustment: updates.lengthAdjustment,
          humanization_document_id: updates.humanizationDocumentId
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      set(state => {
        const updatedProjects = state.projects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        );
        
        const updatedCurrentProject = state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates } 
          : state.currentProject;
          
        return { 
          projects: updatedProjects,
          currentProject: updatedCurrentProject
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteProject: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const filteredProjects = state.projects.filter(project => project.id !== id);
        const updatedCurrentProject = state.currentProject?.id === id 
          ? null 
          : state.currentProject;
          
        return { 
          projects: filteredProjects,
          currentProject: updatedCurrentProject
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  humanizeText: async (
    text: string, 
    mode: 'standard' | 'casual' | 'academic' | 'creative' = 'standard',
    options: HumanizeOptions = {}
  ) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ loading: true, error: null });
      
      // Check minimum text length requirement
      if (text.length < 50) {
        throw new Error('Text must be at least 50 characters long to be humanized.');
      }
      
      // Calculate credits required for this operation
      const creditsRequired = Math.ceil(text.length / 100);
      
      // Check if user has sufficient credits
      if (user.creditsUsed + creditsRequired > user.maxCredits) {
        throw new Error('Insufficient credits. Please upgrade your plan or purchase more credits.');
      }
      
      // Call the actual API with the provided mode and options
      const result = await humanizeTextApi(text, mode, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to humanize text');
      }
      
      // Update user credits only if humanization was successful
      await useAuthStore.getState().updateUserProfile({
        creditsUsed: user.creditsUsed + creditsRequired
      });

      // The result now contains a documentId that we should store
      return {
        humanizedText: result.humanizedText,
        documentId: result.documentId
      };
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));