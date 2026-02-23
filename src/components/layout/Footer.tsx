export default function Footer() {
    return (
        <footer className="bg-secondary border-t border-white/10 text-gray-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <img src="/logodourada.png" alt="MS Sports Logo" className="h-32 w-auto mb-4" />
                        <p className="text-sm">Elevate your game with professional-gear designed for the elite athlete.</p>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-bold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Elite Club Kits</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Legendary Editions</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Training Gear</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Order Status</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} MS Sports. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
