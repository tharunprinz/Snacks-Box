import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-primary-brown to-primary-yellow text-white py-6 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center">
          <p className="text-sm md:text-base font-semibold">
            © {currentYear} SNACK BOX. All Rights Reserved.
          </p>
          <p className="text-xs md:text-sm mt-2 opacity-90">
            Karpagam College of Engineering | +91-9500633444
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

