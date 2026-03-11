const { customers, vehicles, serviceOrders, invoices, payments } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    const totalCustomers = await customers.count();
    const totalVehicles = await vehicles.count();
    
    const activeServiceOrders = await serviceOrders.count({
      where: {
        status: {
          [Op.in]: ['Pending', 'In Progress']
        }
      }
    });

    // Monthly Revenue (sum of totalAmount from all invoices created this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRevenueRaw = await invoices.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    res.json({
      status: 'success',
      data: {
        totalCustomers: totalCustomers.toString(),
        totalVehicles: totalVehicles.toString(),
        activeServiceOrders: activeServiceOrders.toString(),
        monthlyRevenue: (monthlyRevenueRaw || 0).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};
