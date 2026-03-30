import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

const createToken = (admin) => {
  return jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '1d' });
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword }
    });

    res.json({
      token: createToken(admin),
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });

    

    console.log(admin ? 'Admin exists' : 'Admin does not exist'); // Debugging log

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    console.log(isMatch ? 'Password match successful' : 'Password match failed'); // Debugging log

    res.json({
      token: createToken(admin),
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Login error:', err); // Debugging log
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

export default router;
