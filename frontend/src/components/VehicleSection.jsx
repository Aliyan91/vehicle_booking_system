import { useState } from 'react';
import toast from 'react-hot-toast';
import { createVehicle, updateVehicle, deleteVehicle, toggleVehicleAvailability } from '../api';

export default function VehicleSection({ vehicles, onRefresh }) {
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: 2024, licensePlate: '', dailyRate: 100 });
  const [editingVehicle, setEditingVehicle] = useState(null);

  const addVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.licensePlate) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await createVehicle(newVehicle);
      setNewVehicle({ make: '', model: '', year: 2024, licensePlate: '', dailyRate: 100 });
      await onRefresh();
      toast.success('Vehicle added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create vehicle');
    }
  };

  const handleEditVehicle = async () => {
    if (!editingVehicle.make || !editingVehicle.model || !editingVehicle.licensePlate) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const vehicleData = {
        make: editingVehicle.make,
        model: editingVehicle.model,
        year: editingVehicle.year,
        licensePlate: editingVehicle.licensePlate,
        dailyRate: editingVehicle.dailyRate
      };
      await updateVehicle(editingVehicle.id || editingVehicle._id, vehicleData);
      setEditingVehicle(null);
      await onRefresh();
      toast.success('Vehicle updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      await onRefresh();
      toast.success('Vehicle deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await toggleVehicleAvailability(id, !currentStatus);
      await onRefresh();
      toast.success(`Vehicle marked as ${!currentStatus ? 'Available' : 'Booked'}!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle vehicle availability');
    }
  };

  return (
    <>
      {/* Add Vehicle Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Add Vehicle
        </h2>
        <div className="space-y-3">
          <input placeholder="Make (e.g., Toyota)" value={newVehicle.make} onChange={(e) => setNewVehicle((v) => ({ ...v, make: e.target.value }))} className="input-field" />
          <input placeholder="Model (e.g., Camry)" value={newVehicle.model} onChange={(e) => setNewVehicle((v) => ({ ...v, model: e.target.value }))} className="input-field" />
          <input type="number" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle((v) => ({ ...v, year: Number(e.target.value) }))} className="input-field" />
          <input placeholder="License Plate" value={newVehicle.licensePlate} onChange={(e) => setNewVehicle((v) => ({ ...v, licensePlate: e.target.value }))} className="input-field" />
          <input type="number" placeholder="Daily Rate (₹)" value={newVehicle.dailyRate} onChange={(e) => setNewVehicle((v) => ({ ...v, dailyRate: Number(e.target.value) }))} className="input-field" />
          <button onClick={addVehicle} className="btn-primary w-full">Create Vehicle</button>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
          Vehicles ({vehicles.length})
        </h3>
        <div className="space-y-3 p-1 max-h-96 overflow-y-auto hide-scrollbar">
          {vehicles.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No vehicles yet</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id || v._id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{v.make} {v.model}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {v.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    <p>{v.licensePlate}</p>
                    <p className="text-blue-600 font-semibold mt-1">₹{v.dailyRate}/day</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => setEditingVehicle(v)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 hover:bg-blue-50 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleToggleAvailability(v.id || v._id, v.isAvailable)} className="text-purple-600 hover:text-purple-800 text-xs font-semibold px-3 py-1.5 hover:bg-purple-50 rounded">
                      {v.isAvailable ? 'Mark as Booked' : 'Mark as Available'}
                    </button>
                    <button onClick={() => handleDeleteVehicle(v.id || v._id)} className="text-red-600 hover:text-red-800 text-xs font-semibold px-3 py-1.5 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Vehicle</h2>
            <div className="space-y-3">
              <input placeholder="Make (e.g., Toyota)" value={editingVehicle.make} onChange={(e) => setEditingVehicle((v) => ({ ...v, make: e.target.value }))} className="input-field" />
              <input placeholder="Model (e.g., Camry)" value={editingVehicle.model} onChange={(e) => setEditingVehicle((v) => ({ ...v, model: e.target.value }))} className="input-field" />
              <input type="number" placeholder="Year" value={editingVehicle.year} onChange={(e) => setEditingVehicle((v) => ({ ...v, year: Number(e.target.value) }))} className="input-field" />
              <input placeholder="License Plate" value={editingVehicle.licensePlate} onChange={(e) => setEditingVehicle((v) => ({ ...v, licensePlate: e.target.value }))} className="input-field" />
              <input type="number" placeholder="Daily Rate (₹)" value={editingVehicle.dailyRate} onChange={(e) => setEditingVehicle((v) => ({ ...v, dailyRate: Number(e.target.value) }))} className="input-field" />
              <div className="flex gap-3 mt-6">
                <button onClick={handleEditVehicle} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditingVehicle(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
