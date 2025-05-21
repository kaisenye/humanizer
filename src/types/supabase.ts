export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          credits_used: number;
          subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
          max_credits: number;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits_used?: number;
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          max_credits?: number;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits_used?: number;
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          max_credits?: number;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          content: string;
          humanized_content: string | null;
          credits_used: number;
          mode: 'standard' | 'casual' | 'academic' | 'creative' | null;
          humanization_strength: number | null;
          personality: 'neutral' | 'friendly' | 'professional' | 'casual' | null;
          length_adjustment: 'maintain' | 'shorter' | 'longer' | null;
          humanization_document_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          content: string;
          humanized_content?: string | null;
          credits_used?: number;
          mode?: 'standard' | 'casual' | 'academic' | 'creative' | null;
          humanization_strength?: number | null;
          personality?: 'neutral' | 'friendly' | 'professional' | 'casual' | null;
          length_adjustment?: 'maintain' | 'shorter' | 'longer' | null;
          humanization_document_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          content?: string;
          humanized_content?: string | null;
          credits_used?: number;
          mode?: 'standard' | 'casual' | 'academic' | 'creative' | null;
          humanization_strength?: number | null;
          personality?: 'neutral' | 'friendly' | 'professional' | 'casual' | null;
          length_adjustment?: 'maintain' | 'shorter' | 'longer' | null;
          humanization_document_id?: string | null;
        };
      };
    };
  };
}