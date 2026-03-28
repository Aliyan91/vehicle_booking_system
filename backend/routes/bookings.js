const express = require('express');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const bookings = await Booking.find().populate('customer vehicle').sort('-createdAt');
  res.json(bookings);
});

router.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('customer vehicle');
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json(booking);
});

router.post('/', async (req, res) => {
  const { customerId, vehicleId, startDate, endDate } = req.body;
  if (!customerId || !vehicleId || !startDate || !endDate) return res.status(400).json({ message: 'Missing fields' });

  const customer = await Customer.findById(customerId);
  const vehicle = await Vehicle.findById(vehicleId);
  if (!customer || !vehicle) return res.status(404).json({ message: 'Customer or Vehicle not found' });
  if (!vehicle.isAvailable) return res.status(400).json({ message: 'Vehicle not available' });

  const s = new Date(startDate);
  const e = new Date(endDate);
  if (e < s) return res.status(400).json({ message: 'End date must be after start date' });

  const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  const totalAmount = days * vehicle.dailyRate;

  const booking = await Booking.create({ customer: customerId, vehicle: vehicleId, startDate: s, endDate: e, totalAmount, status: 'confirmed' });
  vehicle.isAvailable = false;
  await vehicle.save();

  res.status(201).json(await booking.populate('customer vehicle'));
});

router.put('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });

  Object.assign(booking, req.body);
  if (req.body.status === 'cancelled') {
    const v = await Vehicle.findById(booking.vehicle);
    if (v) v.isAvailable = true, await v.save();
  }

  await booking.save();
  res.json(await booking.populate('customer vehicle'));
});

router.delete('/:id', async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });

  const vehicle = await Vehicle.findById(booking.vehicle);
  if (vehicle) vehicle.isAvailable = true, await vehicle.save();

  res.json({ message: 'Booking deleted' });
});

module.exports = router;
