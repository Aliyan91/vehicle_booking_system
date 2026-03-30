import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { adminLogin, adminSignup, fetchCustomers, fetchDashboard, fetchBookings, fetchVehicles } from './api';
import CustomerSection from './components/CustomerSection';
import VehicleSection from './components/VehicleSection';
import BookingSection from './components/BookingSection';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [dashboard, setDashboard] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Admin');
  
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
        toast.error('Error fetching data. Please check API connection and login.');
      }
    };
    load();
  }, [isLoggedIn]);

  const handleSignup = async () => {
    try {
      await adminSignup(name, email, password);
      setToken(localStorage.getItem('token'));
      toast.success('Signup successful!');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed');
    }
  };

  const handleLogin = async () => {
    try {
      await adminLogin(email, password);
      setToken(localStorage.getItem('token'));
      toast.success('Login successful!');
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
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
    try {
      setDashboard(await fetchDashboard());
      setCustomers(await fetchCustomers());
      setVehicles(await fetchVehicles());
      setBookings(await fetchBookings());
      toast.success('Data refreshed!');
    } catch (err) {
      toast.error('Failed to refresh data');
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative z-10">
          {/* Left side - Branding */}
          <div className="hidden lg:flex flex-col justify-center items-start text-white px-12">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">Rent-a-Car</h1>
              <p className="text-xl text-blue-200 font-light">Professional Vehicle Booking System</p>
            </div>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 text-blue-400">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Manage Fleet</h3>
                  <p className="text-blue-200 text-sm mt-1">Easily manage your vehicle inventory</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 text-blue-400">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Track Revenue</h3>
                  <p className="text-blue-200 text-sm mt-1">Real-time earnings and booking stats</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 text-blue-400">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">User Management</h3>
                  <p className="text-blue-200 text-sm mt-1">Control customers and bookings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-4 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Rent-a-Car</h2>
                  <p className="text-blue-200 text-sm mt-1">Admin Dashboard</p>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                <p className="text-blue-100 text-sm mb-8">Sign in to manage your vehicle fleet</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-3">Full Name</label>
                    <div className="relative group">
                      <svg className="absolute left-4 top-3.5 w-5 h-5 text-blue-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-3">Email Address</label>
                    <div className="relative group">
                      <svg className="absolute left-4 top-3.5 w-5 h-5 text-blue-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-3">Password</label>
                    <div className="relative group">
                      <svg className="absolute left-4 top-3.5 w-5 h-5 text-blue-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button 
                    onClick={handleSignup}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    Create Account
                  </button>
                  <button 
                    onClick={handleLogin}
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-300 mb-2">Demo Credentials:</p>
                  <div className="space-y-1 text-xs text-blue-100">
                    <p>Email: <span className="font-mono text-blue-300">admin@example.com</span></p>
                    <p>Password: <span className="font-mono text-blue-300">password123</span></p>
                  </div>
                </div>

                <p className="text-center text-xs text-blue-200/70 mt-6">
                  Secure Admin Dashboard • Enterprise-grade Security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Rent-a-Car Admin</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={refreshAll} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors">
              ↻ Refresh
            </button>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{dashboard.totalCustomers}</p>
                </div>
                <svg className="w-12 h-12 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-semibold">Total Vehicles</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{dashboard.totalVehicles}</p>
                </div>
                <svg className="w-12 h-12 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-semibold">Total Bookings</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{dashboard.totalBookings}</p>
                </div>
                <svg className="w-12 h-12 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-semibold">Total Revenue</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">Rs{dashboard.revenue?.toLocaleString()}</p>
                </div>
                <svg className="w-12 h-12 text-orange-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.16 2.75a.75.75 0 00-1.32 0l-1.91 4.74H.75a.75.75 0 00-.44 1.36l3.85 2.8-1.46 4.53a.75.75 0 00.28.84.75.75 0 00.84-.01l3.85-2.86 3.85 2.86c.26.2.63.25.84.01a.75.75 0 00.28-.84l-1.46-4.53 3.85-2.8a.75.75 0 00-.44-1.36H12.27l-1.91-4.74z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Create Forms & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CustomerSection customers={customers} setCustomers={setCustomers} onRefresh={refreshAll} />
          <VehicleSection vehicles={vehicles} onRefresh={refreshAll} />
          <BookingSection customers={customers} vehicles={vehicles} bookings={bookings} onRefresh={refreshAll} />
        </div>
      </main>
    </div>
    </>
  );
}

export default App;
