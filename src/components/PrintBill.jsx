import { printBill } from '../utils/print';

const PrintBill = ({ order }) => {
  const handlePrint = () => {
    printBill(order);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button
        className="billing-action-btn print-btn"
        onClick={handlePrint}
      >
        🖨️ Print Bill
      </button>
    </div>
  );
};

export default PrintBill;

