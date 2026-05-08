import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, userName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_name: userName }
      }
    });
    if (error) throw error;
    return data;
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function updateUserProfile(updates) {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id);
    if (error) throw error;
    return data;
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile data when logged in
  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        setUserData(null);
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      setUserData(data);
    }
    fetchUserData();
  }, [currentUser]);

  const value = { 
    currentUser, 
    userData,
    signup, 
    login, 
    logout,
    updateUserProfile,
    loading 
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}