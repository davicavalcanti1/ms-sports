export default function Footer() {
    return (
        <footer className="bg-secondary border-t border-white/10 text-gray-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <img src="/logodourada.png" alt="MS Sports Logo" className="h-32 w-auto mb-4" />
                        <p className="text-sm">Camisas oficiais de futebol e basquete para o atleta de elite.</p>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-bold mb-4">Loja</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/catalog?group=Camisas" className="hover:text-primary transition-colors">Camisas de Clube</a></li>
                            <li><a href="/catalog?group=Sele%C3%A7%C3%B5es" className="hover:text-primary transition-colors">Seleções</a></li>
                            <li><a href="/catalog?group=Basquete" className="hover:text-primary transition-colors">Basquete</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-bold mb-4">Atendimento</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://wa.me/5583981109166" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Falar com Rafael</a></li>
                            <li><a href="https://wa.me/5583998168765" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Falar com João Victor</a></li>
                            <li><a href="/catalog" className="hover:text-primary transition-colors">Ver Todos os Produtos</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} MS Sports. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
