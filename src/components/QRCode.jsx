// qrcode.react exports QRCodeSVG as named export
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const QRCode = ({ amount, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate UPI payment string (you can customize this)
  const upiId = 'snackbox@paytm'; // Replace with actual UPI ID
  const paymentString = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=SNACK BOX Order`;

  return (
    <motion.div
      className="cart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cart-modal"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px' }}
      >
        <div className="cart-header">
          <h2>Scan to Pay</h2>
          <button className="close-cart" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="qr-code-container">
            <div className="qr-code">
              <QRCodeSVG value={paymentString} size={250} />
            </div>
          </div>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Scan this QR code to pay ₹{amount.toFixed(2)}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#999' }}>
            UPI ID: {upiId}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCode;

