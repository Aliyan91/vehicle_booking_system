import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });
    if (!customer) return res.status(404).json({ message: 'Not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Customer already exists' });

    const customer = await prisma.customer.create({
      data: { name, email, phone, address }
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error updating customer', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Error deleting customer', error: err.message });
  }
});

export default router;
