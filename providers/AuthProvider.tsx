import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  primary: any | null;
  isProfileLoading: boolean; // Add loading state for profile
};

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  primary: null,
  isProfileLoading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [primary, setPrimary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true); // Track profile fetch

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setPrimary(null);
      setIsProfileLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsProfileLoading(true);
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("User_Profile_RLS")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          return;
        }
     
        setProfile(profileData);

        // Fetch primary
        const { data: primaryData, error: primaryError } = await supabase
          .from("User_Primary_RLS")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (primaryError) {
          console.error("Error fetching primary:", primaryError.message);
          return;
        }
        setPrimary(primaryData);
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setIsProfileLoading(false); // Done fetching profile
      }
    };

    fetchData();
  }, [session?.user]);

  if (isLoading) {
    return null; // Or a loading spinner/component
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, primary, isProfileLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);