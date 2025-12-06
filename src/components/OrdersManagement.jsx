import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../utils/storage';
import { format } from 'date-fns';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const allOrders = storage.getOrders();
    setOrders(allOrders);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    storage.updateOrder(orderId, { status: newStatus });
    loadOrders(); // Reload to reflect changes
  };

  // Group orders by user
  const ordersByUser = orders.reduce((acc, order) => {
    const userKey = order.userId || order.userEmail || 'guest';
    const userName = order.userName || 'Guest User';
    
    if (!acc[userKey]) {
      acc[userKey] = {
        userId: order.userId,
        userName,
        userEmail: order.userEmail || '',
        userPhone: order.userPhone || '',
        orders: [],
      };
    }
    acc[userKey].orders.push(order);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'accepted':
        return '✅ Accepted';
      case 'declined':
        return '❌ Declined';
      case 'delivered':
        return '🚚 Delivered';
      default:
        return status;
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Recalculate grouped orders with filtered data
  const filteredOrdersByUser = filteredOrders.reduce((acc, order) => {
    const userKey = order.userId || order.userEmail || 'guest';
    const userName = order.userName || 'Guest User';
    
    if (!acc[userKey]) {
      acc[userKey] = {
        userId: order.userId,
        userName,
        userEmail: order.userEmail || '',
        userPhone: order.userPhone || '',
        orders: [],
      };
    }
    acc[userKey].orders.push(order);
    return acc;
  }, {});

  const sortedUsers = Object.values(filteredOrdersByUser).sort((a, b) => {
    const aLatest = new Date(a.orders[a.orders.length - 1]?.date || 0);
    const bLatest = new Date(b.orders[b.orders.length - 1]?.date || 0);
    return bLatest - aLatest;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    declined: orders.filter(o => o.status === 'declined').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
    >
      <div className="mb-6 pb-4 border-b-2 border-primary-yellow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary-brown">Orders Management</h2>
          <span className="text-sm text-gray-600">
            Total Orders: {stats.total}
          </span>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600">Accepted</p>
            <p className="text-xl font-bold text-blue-700">{stats.accepted}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600">Delivered</p>
            <p className="text-xl font-bold text-green-700">{stats.delivered}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600">Declined</p>
            <p className="text-xl font-bold text-red-700">{stats.declined}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600">Revenue</p>
            <p className="text-xl font-bold text-purple-700">₹{stats.totalRevenue.toFixed(0)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="delivered">Delivered</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {sortedUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedUsers.map((userGroup, idx) => (
            <motion.div
              key={userGroup.userId || userGroup.userEmail || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-yellow transition-all duration-300"
            >
              {/* User Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    👤 {userGroup.userName}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {userGroup.userEmail && <span>📧 {userGroup.userEmail}</span>}
                    {userGroup.userPhone && (
                      <span className="ml-3">📱 {userGroup.userPhone}</span>
                    )}
                  </div>
                  <span className="inline-block mt-2 text-xs font-semibold text-gray-500">
                    {userGroup.orders.length} order{userGroup.orders.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* User Orders */}
              <div className="space-y-4">
                {userGroup.orders
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg mb-1">
                            Order #{order.id}
                          </h4>
                          <p className="text-sm opacity-80">
                            {format(new Date(order.date), 'PPpp')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusBadge(order.status)}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="mb-3 bg-white/50 rounded p-3">
                        <h5 className="font-semibold mb-2">Items:</h5>
                        <ul className="space-y-1">
                          {order.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-sm flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-300 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            onClick={() => handleStatusUpdate(order.id, 'accepted')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ✅ Accept Order
                          </motion.button>
                          <motion.button
                            onClick={() => handleStatusUpdate(order.id, 'declined')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ❌ Decline Order
                          </motion.button>
                        </div>
                      )}

                      {order.status === 'accepted' && (
                        <motion.button
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          🚚 Mark as Delivered
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersManagement;

