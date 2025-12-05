import { motion } from 'framer-motion';

const ShopShowcase = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="relative h-64 md:h-80 lg:h-96">
        <motion.img
          src="/logo.png"
          alt="SNACK BOX"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&h=400&fit=crop';
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg"
        >
          Welcome to SNACK BOX
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl mb-6 drop-shadow-md"
        >
          Fresh bakes, cool shakes and crunchy bites – all in one cozy spot.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-2">📍 Location</h3>
            <p className="text-white/90">SNACK BOX, Your Local Street Corner</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-2">🕐 Timings</h3>
            <p className="text-white/90">Everyday: 11:00 AM – 11:00 PM</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-2">📞 Contact</h3>
            <p className="text-white/90">WhatsApp / Call: +91-00000-00000</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ShopShowcase;
