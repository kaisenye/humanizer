import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  session: any | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  session: null,
  initialized: false,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      set({ session: data.session });
      await get().fetchUserProfile();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email: string, password: string, username: string) => {
    try {
      set({ loading: true, error: null });
      
      // First check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('Username is already taken');
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username // Store username in user metadata
          }
        }
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error('Please check your email to confirm your account');
      }

      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user!.id,
          username,
          credits_used: 0,
          subscription_tier: 'free',
          max_credits: 100,
        });

      if (profileError) throw profileError;

      set({ session: data.session });
      await get().fetchUserProfile();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, session: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        set({ user: null, session: null, initialized: true });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        set({
          user: {
            id: data.id,
            email: session.user.email || '',
            username: data.username || '',
            fullName: data.full_name || '',
            avatarUrl: data.avatar_url || '',
            creditsUsed: data.credits_used,
            subscriptionTier: data.subscription_tier,
            maxCredits: data.max_credits,
          },
          session,
          initialized: true,
        });
      }
    } catch (error: any) {
      set({ error: error.message, initialized: true });
    }
  },

  updateUserProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          credits_used: updates.creditsUsed,
          subscription_tier: updates.subscriptionTier,
          max_credits: updates.maxCredits,
        })
        .eq('id', user.id);

      if (error) throw error;

      set({
        user: { ...user, ...updates },
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));