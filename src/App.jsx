import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import Billing from './components/Billing';
import MenuManager from './components/MenuManager';
import SalesReport from './components/SalesReport';
import Login from './components/Login';
import { storage } from './utils/storage';
import './styles/App.css';
import './styles/animations.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [cartOpen, setCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    if (storage.isAdminAuthenticated()) {
      setIsAdmin(true);
    }
  }, []);

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      // If already admin, go back to menu
      setCurrentView('menu');
      setIsAdmin(false);
      storage.setAdminAuth(false);
    } else {
      // Check if already authenticated
      if (storage.isAdminAuthenticated()) {
        setIsAdmin(true);
        setCurrentView('admin');
      } else {
        // Show login
        setShowLogin(true);
      }
    }
  };

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setCurrentView('admin');
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentView('billing');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    storage.setAdminAuth(false);
    setCurrentView('menu');
  };

  const renderContent = () => {
    if (showLogin) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'menu':
        return <MenuSection />;
      case 'billing':
        return <Billing onBack={handleBackToMenu} />;
      case 'admin':
        return (
          <>
            <MenuManager />
            <div style={{ marginTop: '2rem' }}>
              <button
                className="nav-button"
                onClick={() => setCurrentView('sales')}
                style={{ marginRight: '1rem' }}
              >
                📊 View Sales Report
              </button>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        );
      case 'sales':
        return (
          <>
            <SalesReport />
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                className="nav-button"
                onClick={() => setCurrentView('admin')}
              >
                ← Back to Menu Management
              </button>
            </div>
          </>
        );
      default:
        return <MenuSection />;
    }
  };

  return (
    <CartProvider>
      <MenuProvider>
        <div className="App">
          {!showLogin && (
            <Header
              onCartClick={handleCartClick}
              onAdminClick={handleAdminClick}
              isAdmin={isAdmin}
            />
          )}
          {renderContent()}
          {!isAdmin && currentView === 'menu' && (
            <Cart
              isOpen={cartOpen}
              onClose={() => setCartOpen(false)}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </MenuProvider>
    </CartProvider>
  );
}

export default App;

