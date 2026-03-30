import { useState } from 'react';
import toast from 'react-hot-toast';
import { createBooking, updateBooking, deleteBooking } from '../api';

export default function BookingSection({ customers, vehicles, bookings, onRefresh }) {
  const [newBooking, setNewBooking] = useState({ customerId: '', vehicleId: '', startDate: '', endDate: '' });
  const [editingBooking, setEditingBooking] = useState(null);

  const addBooking = async () => {
    if (!newBooking.customerId || !newBooking.vehicleId || !newBooking.startDate || !newBooking.endDate) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await createBooking(newBooking);
      setNewBooking({ customerId: '', vehicleId: '', startDate: '', endDate: '' });
      await onRefresh();
      toast.success('Booking created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create booking');
    }
  };

  const handleEditBooking = async () => {
    if (!editingBooking.customerId || !editingBooking.vehicleId || !editingBooking.startDate || !editingBooking.endDate) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const bookingData = {
        customerId: editingBooking.customerId,
        vehicleId: editingBooking.vehicleId,
        startDate: editingBooking.startDate,
        endDate: editingBooking.endDate
      };
      await updateBooking(editingBooking.id || editingBooking._id, bookingData);
      setEditingBooking(null);
      await onRefresh();
      toast.success('Booking updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      await onRefresh();
      toast.success('Booking deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete booking');
    }
  };

  return (
    <>
      {/* Create Booking Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          New Booking
        </h2>
        <div className="space-y-3">
          <select value={newBooking.customerId} onChange={(e) => setNewBooking((v) => ({ ...v, customerId: e.target.value }))} className="input-field">
            <option value="">Select a Customer</option>
            {customers.map((c) => (<option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>))}
          </select>
          <select value={newBooking.vehicleId} onChange={(e) => setNewBooking((v) => ({ ...v, vehicleId: e.target.value }))} className="input-field">
            <option value="">Select a Vehicle</option>
            {vehicles.filter((v) => v.isAvailable).map((v) => (<option key={v.id || v._id} value={v.id || v._id}>{v.make} {v.model}</option>))}
          </select>
          <input type="date" value={newBooking.startDate} onChange={(e) => setNewBooking((v) => ({ ...v, startDate: e.target.value }))} className="input-field" />
          <input type="date" value={newBooking.endDate} onChange={(e) => setNewBooking((v) => ({ ...v, endDate: e.target.value }))} className="input-field" />
          <button onClick={addBooking} className="btn-primary w-full">Create Booking</button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Bookings ({bookings.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No bookings yet</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id || b._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{b.customer.name}</p>
                    <p className="text-gray-600 text-xs">{b.vehicle.make} {b.vehicle.model}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-500 text-xs">{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</p>
                      <p className="text-blue-600 font-semibold text-xs">₹{b.totalAmount}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => setEditingBooking(b)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 hover:bg-blue-50 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteBooking(b.id || b._id)} className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Booking</h2>
            <div className="space-y-3">
              <select value={editingBooking.customerId} onChange={(e) => setEditingBooking((v) => ({ ...v, customerId: e.target.value }))} className="input-field">
                <option value="">Select a Customer</option>
                {customers.map((c) => (<option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>))}
              </select>
              <select value={editingBooking.vehicleId} onChange={(e) => setEditingBooking((v) => ({ ...v, vehicleId: e.target.value }))} className="input-field">
                <option value="">Select a Vehicle</option>
                {vehicles.map((v) => (<option key={v.id || v._id} value={v.id || v._id}>{v.make} {v.model}</option>))}
              </select>
              <input type="date" value={editingBooking.startDate} onChange={(e) => setEditingBooking((v) => ({ ...v, startDate: e.target.value }))} className="input-field" />
              <input type="date" value={editingBooking.endDate} onChange={(e) => setEditingBooking((v) => ({ ...v, endDate: e.target.value }))} className="input-field" />
              <div className="flex gap-3 mt-6">
                <button onClick={handleEditBooking} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditingBooking(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
