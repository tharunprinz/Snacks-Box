import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { CustomerProvider } from './context/CustomerContext';
import { storage } from './utils/storage';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import Billing from './components/Billing';
import CustomerAuth from './components/CustomerAuth';
import CustomerProfile from './components/CustomerProfile';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import './styles/App.css';
import './styles/animations.css';

function App() {
  const isAdminApp = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [currentView, setCurrentView] = useState(isAdminApp ? 'admin' : 'menu'); // 'menu' | 'billing' | 'admin'
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    storage.isAdminAuthenticated()
  );

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentView('billing');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    storage.setAdminAuth(false);
    setIsAdminAuthenticated(false);
    setCurrentView('menu');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'menu':
        return isAdminApp ? null : <MenuSection />;
      case 'billing':
        return <Billing onBack={handleBackToMenu} />;
      case 'admin':
        return isAdminAuthenticated ? (
          <AdminDashboard onLogout={handleAdminLogout} />
        ) : (
          <Login onLogin={handleAdminLoginSuccess} />
        );
      default:
        return <MenuSection />;
    }
  };

  return (
    <CustomerProvider>
      <CartProvider>
        <MenuProvider>
          <div className={`min-h-screen ${!isAdminApp ? 'bg-gradient-to-br from-gray-50 to-gray-100' : ''}`}>
            {!isAdminApp && (
              <Header
                onCartClick={handleCartClick}
                onLoginClick={() => setAuthOpen(true)}
                onProfileClick={() => setProfileOpen(true)}
              />
            )}
            {renderContent()}
            {!isAdminApp && currentView === 'menu' && (
              <>
                <Cart
                  isOpen={cartOpen}
                  onClose={() => setCartOpen(false)}
                  onCheckout={handleCheckout}
                />
                {authOpen && (
                  <CustomerAuth
                    isOpen={authOpen}
                    onClose={() => setAuthOpen(false)}
                  />
                )}
                {profileOpen && (
                  <CustomerProfile
                    isOpen={profileOpen}
                    onClose={() => setProfileOpen(false)}
                  />
                )}
              </>
            )}
            <Footer />
          </div>
        </MenuProvider>
      </CartProvider>
    </CustomerProvider>
  );
}

export default App;

