import { useState, useEffect } from 'react';
import { calculateSales } from '../utils/sales';
import { format } from 'date-fns';

const SalesReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const data = calculateSales(selectedMonth, selectedYear);
    setSalesData(data);
  }, [selectedMonth, selectedYear]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (!salesData) {
    return (
      <div className="sales-report">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-report">
      <div className="sales-header">
        <h1 style={{ color: '#AD703C' }}>Monthly Sales Report</h1>
        <div className="filter-group">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">₹{salesData.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{salesData.orderCount}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {salesData.orderCount > 0 
              ? `₹${(salesData.totalRevenue / salesData.orderCount).toFixed(2)}`
              : '₹0.00'
            }
          </div>
          <div className="stat-label">Average Order Value</div>
        </div>
      </div>

      {salesData.topItems.length > 0 && (
        <div className="top-items">
          <h2 style={{ color: '#AD703C', marginBottom: '1rem' }}>Top Selling Items</h2>
          <div className="top-items-list">
            {salesData.topItems.map((item, index) => (
              <div key={index} className="top-item">
                <span style={{ fontWeight: 'bold' }}>
                  #{index + 1} {item.name}
                </span>
                <span style={{ color: '#AD703C', fontWeight: 'bold' }}>
                  {item.quantity} sold
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {salesData.orderCount === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#666',
          background: '#f5f5f5',
          borderRadius: '15px',
          marginTop: '2rem'
        }}>
          <p>No sales data available for {salesData.month}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Report Period</h3>
        <p style={{ color: '#666' }}>{salesData.month}</p>
      </div>
    </div>
  );
};

export default SalesReport;

