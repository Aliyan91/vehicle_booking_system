import { useState } from 'react';
import toast from 'react-hot-toast';
import { createCustomer, updateCustomer, deleteCustomer } from '../api';

export default function CustomerSection({ customers, setCustomers, onRefresh }) {
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await createCustomer(newCustomer);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      await onRefresh();
      toast.success('Customer added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create customer');
    }
  };

  const handleEditCustomer = async () => {
    if (!editingCustomer.name || !editingCustomer.email) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const customerData = {
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address
      };
      await updateCustomer(editingCustomer.id || editingCustomer._id, customerData);
      setEditingCustomer(null);
      await onRefresh();
      toast.success('Customer updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      await onRefresh();
      toast.success('Customer deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete customer');
    }
  };

  return (
    <>
      {/* Add Customer Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add Customer
        </h2>
        <div className="space-y-3">
          <input placeholder="Full Name" value={newCustomer.name} onChange={(e) => setNewCustomer((v) => ({ ...v, name: e.target.value }))} className="input-field" />
          <input placeholder="Email Address" value={newCustomer.email} onChange={(e) => setNewCustomer((v) => ({ ...v, email: e.target.value }))} className="input-field" />
          <input placeholder="Phone Number" value={newCustomer.phone} onChange={(e) => setNewCustomer((v) => ({ ...v, phone: e.target.value }))} className="input-field" />
          <input placeholder="Address" value={newCustomer.address} onChange={(e) => setNewCustomer((v) => ({ ...v, address: e.target.value }))} className="input-field" />
          <button onClick={addCustomer} className="btn-primary w-full">Create Customer</button>
        </div>
      </div>

      {/* Customers List */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Customers ({customers.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {customers.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No customers yet</p>
          ) : (
            customers.map((c) => (
              <div key={c.id || c._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-gray-600 text-xs">{c.email}</p>
                    <p className="text-gray-500 text-xs mt-1">{c.phone}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => setEditingCustomer(c)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 hover:bg-blue-50 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCustomer(c.id || c._id)} className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Customer</h2>
            <div className="space-y-3">
              <input placeholder="Full Name" value={editingCustomer.name} onChange={(e) => setEditingCustomer((v) => ({ ...v, name: e.target.value }))} className="input-field" />
              <input placeholder="Email Address" value={editingCustomer.email} onChange={(e) => setEditingCustomer((v) => ({ ...v, email: e.target.value }))} className="input-field" />
              <input placeholder="Phone Number" value={editingCustomer.phone} onChange={(e) => setEditingCustomer((v) => ({ ...v, phone: e.target.value }))} className="input-field" />
              <input placeholder="Address" value={editingCustomer.address} onChange={(e) => setEditingCustomer((v) => ({ ...v, address: e.target.value }))} className="input-field" />
              <div className="flex gap-3 mt-6">
                <button onClick={handleEditCustomer} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditingCustomer(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
