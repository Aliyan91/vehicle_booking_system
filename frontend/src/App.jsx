import { useEffect, useMemo, useState } from 'react';
import { adminLogin, adminSignup, fetchCustomers, fetchDashboard, fetchBookings, fetchVehicles, createBooking, createCustomer, createVehicle } from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Admin');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: 2024, licensePlate: '', dailyRate: 100 });
  const [newBooking, setNewBooking] = useState({ customerId: '', vehicleId: '', startDate: '', endDate: '' });
  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      try {
        setDashboard(await fetchDashboard());
        setCustomers(await fetchCustomers());
        setVehicles(await fetchVehicles());
        setBookings(await fetchBookings());
      } catch (err) {
        console.error(err);
        setError('Error fetching data. Please check API connection and login.');
      }
    };
    load();
  }, [isLoggedIn]);

  const handleSignup = async () => {
    setError('');
    try {
      await adminSignup(name, email, password);
      setToken(localStorage.getItem('token'));
    } catch (err) {
      console.error(err);
      setError('Signup failed');
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      await adminLogin(email, password);
      setToken(localStorage.getItem('token'));
    } catch (err) {
      console.error(err);
      setError('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setDashboard(null);
    setCustomers([]);
    setVehicles([]);
    setBookings([]);
  };

  const refreshAll = async () => {
    setDashboard(await fetchDashboard());
    setCustomers(await fetchCustomers());
    setVehicles(await fetchVehicles());
    setBookings(await fetchBookings());
  };

  const addCustomer = async () => {
    try {
      await createCustomer(newCustomer);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      await refreshAll();
    } catch (err) {
      setError('Failed create customer');
    }
  };

  const addVehicle = async () => {
    try {
      await createVehicle(newVehicle);
      setNewVehicle({ make: '', model: '', year: 2024, licensePlate: '', dailyRate: 100 });
      await refreshAll();
    } catch (err) {
      setError('Failed create vehicle');
    }
  };

  const addBooking = async () => {
    try {
      await createBooking(newBooking);
      setNewBooking({ customerId: '', vehicleId: '', startDate: '', endDate: '' });
      await refreshAll();
    } catch (err) {
      setError('Failed create booking');
    }
  };

  return (
    <div className="app">
      <h1>Rent-a-Car Vehicle Booking</h1>

      {error && <div className="error">{error}</div>}

      {!isLoggedIn ? (
        <div className="card">
          <h2>Admin Auth</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <div>
            <button onClick={handleSignup}>Signup</button>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={refreshAll}>Refresh</button>
          </div>

          <div className="card grid2">
            <div>
              <h2>Dashboard</h2>
              <p>Total Customers: {dashboard?.totalCustomers}</p>
              <p>Total Vehicles: {dashboard?.totalVehicles}</p>
              <p>Total Bookings: {dashboard?.totalBookings}</p>
              <p>Revenue: ₹{dashboard?.revenue}</p>
            </div>
          </div>

          <div className="card">
            <h2>Create Customer</h2>
            <input placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer((v) => ({ ...v, name: e.target.value }))} />
            <input placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer((v) => ({ ...v, email: e.target.value }))} />
            <input placeholder="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer((v) => ({ ...v, phone: e.target.value }))} />
            <input placeholder="Address" value={newCustomer.address} onChange={(e) => setNewCustomer((v) => ({ ...v, address: e.target.value }))} />
            <button onClick={addCustomer}>Add Customer</button>
          </div>

          <div className="card">
            <h2>Create Vehicle</h2>
            <input placeholder="Make" value={newVehicle.make} onChange={(e) => setNewVehicle((v) => ({ ...v, make: e.target.value }))} />
            <input placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle((v) => ({ ...v, model: e.target.value }))} />
            <input type="number" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle((v) => ({ ...v, year: Number(e.target.value) }))} />
            <input placeholder="License Plate" value={newVehicle.licensePlate} onChange={(e) => setNewVehicle((v) => ({ ...v, licensePlate: e.target.value }))} />
            <input type="number" placeholder="Daily Rate" value={newVehicle.dailyRate} onChange={(e) => setNewVehicle((v) => ({ ...v, dailyRate: Number(e.target.value) }))} />
            <button onClick={addVehicle}>Add Vehicle</button>
          </div>

          <div className="card">
            <h2>Create Booking</h2>
            <select value={newBooking.customerId} onChange={(e) => setNewBooking((v) => ({ ...v, customerId: e.target.value }))}>
              <option value="">Select Customer</option>
              {customers.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
            </select>
            <select value={newBooking.vehicleId} onChange={(e) => setNewBooking((v) => ({ ...v, vehicleId: e.target.value }))}>
              <option value="">Select Vehicle</option>
              {vehicles.filter((v) => v.isAvailable).map((v) => (<option key={v._id} value={v._id}>{v.make} {v.model} ({v.licensePlate})</option>))}
            </select>
            <input type="date" value={newBooking.startDate} onChange={(e) => setNewBooking((v) => ({ ...v, startDate: e.target.value }))} />
            <input type="date" value={newBooking.endDate} onChange={(e) => setNewBooking((v) => ({ ...v, endDate: e.target.value }))} />
            <button onClick={addBooking}>Add Booking</button>
          </div>

          <div className="card grid3">
            <div><h3>Customers</h3>{customers.map((c) => (<div key={c._id} className="item">{c.name} - {c.email}</div>))}</div>
            <div><h3>Vehicles</h3>{vehicles.map((v) => (<div key={v._id} className="item">{v.make} {v.model} [{v.licensePlate}] - {v.isAvailable ? 'Available' : 'Booked'}</div>))}</div>
            <div><h3>Bookings</h3>{bookings.map((b) => (<div key={b._id} className="item">{b.customer.name} booked {b.vehicle.make} {b.vehicle.model} from {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} ₹{b.totalAmount}</div>))}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
