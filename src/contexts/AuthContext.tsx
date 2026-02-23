import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithWhatsApp: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    loading: true,
    signInWithWhatsApp: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAdminStatus = async (userObj: User | undefined | null) => {
        if (!userObj || !userObj.email) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        setLoading(true); // Ensure routing waits!
        try {
            const { data, error } = await supabase
                .from('admins')
                .select('email')
                .eq('email', userObj.email)
                .single();

            if (data && !error) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch {
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const signInWithWhatsApp = async () => {
        // For standard customers, we don't necessarily need them to "login" fully 
        // if checkout is via WA, but if we do, OTP via WA or email is possible.
        // For admin access, standard email/password is better.
        // We'll leave this as a placeholder or implement basic email/password for now.
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, signInWithWhatsApp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
