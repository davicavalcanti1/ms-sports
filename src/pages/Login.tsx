import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    // Redirect if already logged in and admin
    if (isAdmin) {
        navigate('/');
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // The AuthContext will catch the session change, but we navigate to admin panel here
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-8 max-w-md w-full gold-glow">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-background-dark text-white border border-primary/30 rounded p-3 focus:outline-none focus:border-primary transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-background-dark text-white border border-primary/30 rounded p-3 focus:outline-none focus:border-primary transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={async () => {
                                if (!email) {
                                    setError('Por favor, digite seu email primeiro.');
                                    return;
                                }
                                setLoading(true);
                                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                    redirectTo: window.location.origin + '/admin',
                                });
                                setLoading(false);
                                if (error) {
                                    setError(error.message);
                                } else {
                                    setError('Email de recuperação enviado! Verifique sua caixa de entrada.');
                                }
                            }}
                            className="text-primary text-xs hover:underline bg-transparent border-none p-0"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded uppercase tracking-wider transition-colors disabled:opacity-50 mt-6"
                    >
                        {loading ? 'Processando...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
