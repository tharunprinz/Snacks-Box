import { motion } from 'framer-motion';
import MenuManager from './MenuManager';
import SalesReport from './SalesReport';
import FeedbackAdmin from './FeedbackAdmin';
import PromoManager from './PromoManager';
import OrdersManagement from './OrdersManagement';

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-primary-yellow to-primary-brown bg-clip-text text-transparent"
            >
              Admin Dashboard
            </motion.h1>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Orders Management */}
        <OrdersManagement />

        {/* Promo Manager */}
        <PromoManager />

        {/* Menu Manager */}
        <MenuManager />

        {/* Sales Report */}
        <SalesReport />

        {/* Feedback Admin */}
        <FeedbackAdmin />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
