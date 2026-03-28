const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('-createdAt');
  res.json(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Not found' });
  res.json(customer);
});

router.post('/', async (req, res) => {
  const { name, email, phone, address } = req.body;
  const existing = await Customer.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Customer already exists' });
  const customer = await Customer.create({ name, email, phone, address });
  res.status(201).json(customer);
});

router.put('/:id', async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Customer.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Customer deleted' });
});

module.exports = router;
