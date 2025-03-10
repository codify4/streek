import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean;
  signOut: () => Promise<void>;
  setOnboardingCompleted: (completed: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true, onboardingCompleted: false, signOut: async () => {}, setOnboardingCompleted: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      } else {
        setOnboardingCompleted(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkOnboardingStatus(userId: string) {
    try {
      console.log("Checking onboarding status for user:", userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();
      
      console.log("Profile data:", data);
      console.log("Error:", error);
      
      if (error) {
        // Handle the case where no profile exists (PGRST116 error)
        if (error.code === 'PGRST116' || error.message.includes('no rows')) {
          // No profile found, user hasn't completed onboarding
          console.log("No profile found, setting onboardingCompleted to false");
          setOnboardingCompleted(false);
        } else {
          // Some other error occurred
          console.error('Error checking onboarding status:', error);
        }
      } else {
        // Profile found, check if onboarding is completed
        console.log("Profile found, onboarding_completed:", data?.onboarding_completed);
        setOnboardingCompleted(data?.onboarding_completed === true);
      }
    } catch (error) {
      console.error('Unexpected error checking onboarding:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    session,
    loading,
    onboardingCompleted,
    signOut,
    setOnboardingCompleted,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};