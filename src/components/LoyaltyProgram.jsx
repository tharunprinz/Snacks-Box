import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';
import { storage } from '../utils/storage';
import { showToast } from './Toast';

const LoyaltyProgram = () => {
  const { customer } = useCustomer();
  const [loyaltyData, setLoyaltyData] = useState({ points: 0, history: [] });
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');

  useEffect(() => {
    if (customer?.id) {
      const data = storage.getLoyaltyPoints(customer.id);
      setLoyaltyData(data);
    }
  }, [customer]);

  // Refresh loyalty points periodically (in case points are added from another tab/component)
  useEffect(() => {
    if (customer?.id) {
      const interval = setInterval(() => {
        const data = storage.getLoyaltyPoints(customer.id);
        setLoyaltyData(data);
      }, 2000); // Check every 2 seconds
      return () => clearInterval(interval);
    }
  }, [customer]);

  const pointsToDiscount = (points) => {
    // 100 points = ₹10 discount
    return Math.floor(points / 100) * 10;
  };

  const handleRedeem = () => {
    const points = parseInt(redeemAmount);
    if (!points || points < 100) {
      showToast('Minimum 100 points required to redeem', 'error');
      return;
    }
    if (points && customer?.id) {
      const result = storage.redeemLoyaltyPoints(customer.id, points);
      if (result) {
        setLoyaltyData(result);
        setShowRedeem(false);
        setRedeemAmount('');
        showToast(`Successfully redeemed ${points} points! ₹${pointsToDiscount(points)} discount available! ⭐`, 'success');
      } else {
        showToast('Insufficient points!', 'error');
      }
    }
  };

  if (!customer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-primary-yellow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-primary-brown flex items-center gap-2">
          ⭐ Loyalty Program
        </h3>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-brown">{loyaltyData.points || 0}</p>
          <p className="text-sm text-gray-600">Points</p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-white rounded-lg">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Earn Points:</strong> Get 10 points for every ₹100 spent
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <strong>Redeem Points:</strong> 100 points = ₹10 discount
        </p>
        <p className="text-lg font-bold text-primary-brown mt-3">
          Available Discount: ₹{pointsToDiscount(loyaltyData.points || 0)}
        </p>
      </div>

      {loyaltyData.points >= 100 && (
        <motion.button
          onClick={() => setShowRedeem(!showRedeem)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-primary-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-yellow hover:text-primary-brown transition-all duration-300"
        >
          {showRedeem ? 'Cancel' : 'Redeem Points'}
        </motion.button>
      )}

      {showRedeem && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-white rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter points to redeem (minimum 100):
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="100"
              step="100"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none"
              placeholder="100, 200, 300..."
            />
            <motion.button
              onClick={handleRedeem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Redeem
            </motion.button>
          </div>
          {redeemAmount && (
            <p className="text-sm text-gray-600 mt-2">
              You'll get ₹{pointsToDiscount(parseInt(redeemAmount) || 0)} discount
            </p>
          )}
        </motion.div>
      )}

      {loyaltyData.history && loyaltyData.history.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Recent Activity:</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {loyaltyData.history.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} className="text-sm text-gray-600 flex justify-between">
                <span>{entry.reason}</span>
                <span className={entry.points > 0 ? 'text-green-600' : 'text-red-600'}>
                  {entry.points > 0 ? '+' : ''}{entry.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LoyaltyProgram;

