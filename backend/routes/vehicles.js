const express = require('express');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const vehicles = await Vehicle.find().sort('-createdAt');
  res.json(vehicles);
});

router.get('/:id', async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Not found' });
  res.json(vehicle);
});

router.post('/', async (req, res) => {
  const { make, model, year, licensePlate, dailyRate } = req.body;
  const existing = await Vehicle.findOne({ licensePlate });
  if (existing) return res.status(400).json({ message: 'Vehicle already exists' });
  const vehicle = await Vehicle.create({ make, model, year, licensePlate, dailyRate, isAvailable: true });
  res.status(201).json(vehicle);
});

router.put('/:id', async (req, res) => {
  const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Vehicle.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Vehicle deleted' });
});

module.exports = router;
