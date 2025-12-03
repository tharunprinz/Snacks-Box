import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { storage } from './storage';

export const calculateSales = (month, year) => {
  const orders = storage.getOrders();
  const targetDate = new Date(year, month - 1, 1);
  const startDate = startOfMonth(targetDate);
  const endDate = endOfMonth(targetDate);

  const filteredOrders = orders.filter(order => {
    const orderDate = parseISO(order.date);
    return isWithinInterval(orderDate, { start: startDate, end: endDate });
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = filteredOrders.length;

  // Calculate top selling items
  const itemCounts = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const key = item.name;
      itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
    });
  });

  const topItems = Object.entries(itemCounts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return {
    totalRevenue,
    orderCount,
    topItems,
    orders: filteredOrders,
    month: format(targetDate, 'MMMM yyyy'),
  };
};

export const getAllSalesData = () => {
  const orders = storage.getOrders();
  return orders.map(order => ({
    date: order.date,
    total: order.total,
    items: order.items,
  }));
};

