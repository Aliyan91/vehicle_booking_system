import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { customer: true, vehicle: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { customer: true, vehicle: true }
    });
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerId, vehicleId, startDate, endDate } = req.body;
    if (!customerId || !vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing fields' });

    }
    

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!customer || !vehicle) return res.status(404).json({ message: 'Customer or Vehicle not found' });
    if (!vehicle.isAvailable) return res.status(400).json({ message: 'Vehicle not available' });

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return res.status(400).json({ message: 'End date must be after start date' });

    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = days * vehicle.dailyRate;

    const booking = await prisma.booking.create({
      data: {
        customerId,
        vehicleId,
        startDate: s,
        endDate: e,
        totalAmount,
        status: 'confirmed'
      },
      include: { customer: true, vehicle: true }
    });

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isAvailable: false }
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { customerId, vehicleId, startDate, endDate, status } = req.body;
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { customer: true, vehicle: true }
    });

    if (!booking) return res.status(404).json({ message: 'Not found' });

    if (!customerId || !vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!customer || !vehicle) return res.status(404).json({ message: 'Customer or Vehicle not found' });

    // If switching vehicle, restore old vehicle availability and reserve new vehicle.
    if (booking.vehicleId !== vehicleId) {
      await prisma.vehicle.update({ where: { id: booking.vehicleId }, data: { isAvailable: true } });
      if (!vehicle.isAvailable) return res.status(400).json({ message: 'New vehicle not available' });
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { isAvailable: false } });
    }

    // If cancelling booking, free the vehicle.
    if (status === 'cancelled') {
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { isAvailable: true } });
    } else {
      // Make sure vehicle remains reserved
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { isAvailable: false } });
    }

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return res.status(400).json({ message: 'End date must be after start date' });

    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = days * vehicle.dailyRate;

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        customerId,
        vehicleId,
        startDate: s,
        endDate: e,
        totalAmount,
        status: status || booking.status
      },
      include: { customer: true, vehicle: true }
    });

    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error updating booking', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });

    if (!booking) return res.status(404).json({ message: 'Not found' });

    await prisma.vehicle.update({
      where: { id: booking.vehicleId },
      data: { isAvailable: true }
    });

    await prisma.booking.delete({ where: { id: req.params.id } });

    res.json({ message: 'Booking deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error deleting booking', error: err.message });
  }
});

export default router;
