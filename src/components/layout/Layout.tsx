import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartNotification from './CartNotification';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen text-white font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
            <CartNotification />
        </div>
    );
}
