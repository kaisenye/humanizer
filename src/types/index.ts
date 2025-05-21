export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  creditsUsed: number;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  maxCredits: number;
}

export interface Project {
  id: string;
  createdAt: string;
  userId: string;
  title: string;
  content: string;
  humanizedContent: string | null;
  creditsUsed: number;
  mode?: 'standard' | 'casual' | 'academic' | 'creative';
  humanizationStrength?: number;
  personality?: 'neutral' | 'friendly' | 'professional' | 'casual';
  lengthAdjustment?: 'maintain' | 'shorter' | 'longer';
  humanizationDocumentId?: string;
}

export interface PlanInfo {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  credits: number;
  features: string[];
  popularPlan?: boolean;
}