import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export async function adminSignup(name, email, password) {
  const res = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function adminLogin(email, password) {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function fetchDashboard() {
  const res = await axios.get(`${API_URL}/api/dashboard`, { headers: authHeaders() });
  return res.data;
}

export async function fetchCustomers() {
  const res = await axios.get(`${API_URL}/api/customers`, { headers: authHeaders() });
  return res.data;
}

export async function fetchVehicles() {
  const res = await axios.get(`${API_URL}/api/vehicles`, { headers: authHeaders() });
  return res.data;
}

export async function fetchBookings() {
  const res = await axios.get(`${API_URL}/api/bookings`, { headers: authHeaders() });
  return res.data;
}

export async function createCustomer(data) {
  const res = await axios.post(`${API_URL}/api/customers`, data, { headers: authHeaders() });
  return res.data;
}

export async function createVehicle(data) {
  const res = await axios.post(`${API_URL}/api/vehicles`, data, { headers: authHeaders() });
  return res.data;
}

export async function createBooking(data) {
  const res = await axios.post(`${API_URL}/api/bookings`, data, { headers: authHeaders() });
  return res.data;
}
