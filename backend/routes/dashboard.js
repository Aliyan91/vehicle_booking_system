import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalCustomers = await prisma.customer.count();
    const totalVehicles = await prisma.vehicle.count();

    const bookingData = await prisma.booking.aggregate({
      _sum: { totalAmount: true }
    });

    const revenue = bookingData._sum.totalAmount || 0;

    res.json({ totalBookings, totalCustomers, totalVehicles, revenue });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});

export default router;
