import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute() {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex bg-background min-h-screen items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col bg-background min-h-[70vh] items-center justify-center p-4">
                <div className="bg-[#1a1a1a] border border-red-500/30 rounded-xl p-8 max-w-md w-full text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h2>
                    <p className="text-slate-400 mb-6">Esta conta não possui a flag 'is_admin' ativada no Supabase (tabela profiles). Verifique suas permissões.</p>
                    <button
                        onClick={() => {
                            const hostname = window.location.hostname;
                            if (hostname === 'admin.localhost') {
                                window.location.assign('http://localhost:5173');
                            } else {
                                const mainStoreUrl = window.location.href.replace('admin.', 'loja.');
                                window.location.assign(mainStoreUrl.split('/admin')[0] || '/');
                            }
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-white/10"
                    >
                        Voltar para a Loja
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
}
