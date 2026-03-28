const express = require('express');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const totalVehicles = await Vehicle.countDocuments();
  const revenueAgg = await Booking.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalAmount' } } }]);
  const revenue = revenueAgg.length ? revenueAgg[0].revenue : 0;

  res.json({ totalBookings, totalCustomers, totalVehicles, revenue });
});

module.exports = router;
