export const printBill = (order) => {
  const printWindow = window.open('', '_blank');
  
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SNACK BOX - Bill</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #AD703C;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #EDC94F;
            margin: 0;
            font-size: 24px;
          }
          .header p {
            color: #AD703C;
            margin: 5px 0;
          }
          .order-info {
            margin-bottom: 15px;
          }
          .order-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          .items {
            margin: 20px 0;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
          }
          .item-name {
            flex: 1;
          }
          .item-qty {
            margin: 0 10px;
          }
          .item-price {
            text-align: right;
            min-width: 80px;
          }
          .total {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #AD703C;
            text-align: right;
          }
          .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #AD703C;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
            font-size: 12px;
            color: #666;
          }
          .no-print {
            text-align: center;
            margin-top: 20px;
          }
          .no-print button {
            background: #EDC94F;
            color: #AD703C;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SNACK BOX</h1>
          <p>Food & Chats Store</p>
        </div>
        <div class="order-info">
          <p><strong>Order #:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        </div>
        <div class="items">
          ${order.items.map(item => `
            <div class="item-row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">x${item.quantity}</span>
              <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div class="total">
          <div class="total-amount">Total: ₹${order.total.toFixed(2)}</div>
        </div>
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Visit us again!</p>
        </div>
        <div class="no-print">
          <button onclick="window.print()">Print Bill</button>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Auto-print after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

