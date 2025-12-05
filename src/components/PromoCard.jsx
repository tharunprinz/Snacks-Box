import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { useMenu } from '../context/MenuContext';

const PromoCard = () => {
  const { customer, isLoggedIn, addOfferReceived } = useCustomer();
  const { menu } = useMenu();
  const [promoData, setPromoData] = useState(storage.getPromo());
  const [personalizedOffer, setPersonalizedOffer] = useState(null);

  useEffect(() => {
    // Load promo data from storage
    setPromoData(storage.getPromo());
    
    // Generate personalized offers for logged-in customers
    if (isLoggedIn && customer) {
      const offers = [
        {
          title: `Welcome ${customer.name}! 🎉`,
          message: 'Get 10% off on your first order! Use code FIRST10 at checkout.',
          type: 'discount',
        },
        {
          title: 'New Arrivals Just For You! ✨',
          message: 'Check out our latest menu items - Chocolate Loaded Cupcakes and Red Velvet Falooda!',
          type: 'new_arrivals',
        },
        {
          title: 'Special Weekend Offer! 🎊',
          message: 'Order any burger combo and get free fries! Valid this weekend only.',
          type: 'combo',
        },
        {
          title: 'Birthday Special! 🎂',
          message: 'Celebrate with us! Get 15% off on all cakes and cupcakes this month.',
          type: 'birthday',
        },
      ];

      // Select a random offer or cycle through them
      const randomOffer = offers[Math.floor(Math.random() * offers.length)];
      
      // Check if this offer was already sent
      const alreadyReceived = customer.offersReceived?.some(
        o => o.title === randomOffer.title && 
        new Date(o.receivedAt).toDateString() === new Date().toDateString()
      );

      if (!alreadyReceived) {
        setPersonalizedOffer(randomOffer);
        addOfferReceived(randomOffer);
      } else {
        // Use a default offer if already received today
        setPersonalizedOffer({
          title: 'Thank You for Being a Valued Customer! 💝',
          message: 'Keep checking back for exclusive deals and new menu items!',
          type: 'general',
        });
      }
    }
  }, [isLoggedIn, customer, addOfferReceived]);

  // Get daily specials and new arrivals from promo data
  const dailySpecials = menu.filter(item => promoData.dailySpecials.includes(item.id));
  const newArrivals = menu.filter(item => promoData.newArrivals.includes(item.id));

  const displayTitle = isLoggedIn && personalizedOffer 
    ? personalizedOffer.title 
    : promoData.title || '🎉 Special Offers & New Arrivals!';

  const displayMessage = isLoggedIn && personalizedOffer
    ? personalizedOffer.message
    : promoData.message || 'Discover our latest delicious treats and exclusive deals. Fresh flavors, amazing prices!';

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-yellow via-primary-brown to-primary-yellow p-8 mb-8 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {displayTitle}
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/95 mb-4 drop-shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {displayMessage}
          </motion.p>
          
          {/* Show daily specials and new arrivals if available */}
          {(dailySpecials.length > 0 || newArrivals.length > 0) && (
            <motion.div
              className="mt-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {dailySpecials.length > 0 && (
                <div className="text-white/90">
                  <span className="font-semibold">⭐ Daily Specials: </span>
                  {dailySpecials.map((item, idx) => (
                    <span key={item.id}>
                      {item.name}{idx < dailySpecials.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {newArrivals.length > 0 && (
                <div className="text-white/90">
                  <span className="font-semibold">🆕 New Arrivals: </span>
                  {newArrivals.map((item, idx) => (
                    <span key={item.id}>
                      {item.name}{idx < newArrivals.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm">
              🔥 Limited Time Offer
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm">
              ✨ New Items
            </span>
            {isLoggedIn && (
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm">
                👤 Personalized
              </span>
            )}
          </motion.div>
        </div>
        
        <motion.img
          src={promoData.imageUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop"}
          alt="Special Offers"
          className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl border-4 border-white/30"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
          }}
        />
      </div>
    </motion.div>
  );
};

export default PromoCard;
