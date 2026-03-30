import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vehicles', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id }
    });
    if (!vehicle) return res.status(404).json({ message: 'Not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vehicle', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { make, model, year, licensePlate, dailyRate } = req.body;
    const existing = await prisma.vehicle.findUnique({ where: { licensePlate } });
    if (existing) return res.status(400).json({ message: 'Vehicle already exists' });

    const vehicle = await prisma.vehicle.create({
      data: { make, model, year, licensePlate, dailyRate, isAvailable: true }
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Error creating vehicle', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('Updating vehicle with ID:', req.params.id); // Debugging log
    const { make, model, year, licensePlate, dailyRate, isAvailable } = req.body;
    const existing = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Vehicle not found' });

    if (licensePlate && licensePlate !== existing.licensePlate) {
      const duplicate = await prisma.vehicle.findUnique({ where: { licensePlate } });
      if (duplicate) return res.status(400).json({ message: 'License plate already in use' });
    }
    const updated = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error updating vehicle', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
  }
});

export default router;
