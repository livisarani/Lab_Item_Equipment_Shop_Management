import React, { useState } from 'react';
import { useAppContext, User } from '../../context/AppContext';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  PowerIcon,
  CheckCircleIcon
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, toggleUserStatus, deleteUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer' as User['role'],
    phone: '',
    address: '',
    department: '',
    organization: '',
    clearanceLevel: 'BSL-1 Standard',
    isActive: true
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.organization || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'customer',
      phone: '',
      address: '',
      department: '',
      organization: '',
      clearanceLevel: 'BSL-1 Standard',
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      department: user.department || '',
      organization: user.organization || '',
      clearanceLevel: user.clearanceLevel || 'Standard',
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Access & Biosafety Clearances
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            User Management
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Manage staff roles, laboratory customer accounts, biosafety clearances, and access status
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-1.5" /> Add New User
        </button>
      </div>

      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              className="pl-10 pr-4 py-2.5 w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#b0b0b0]" />
          </div>
          <select
            className="bg-[#000000] border border-[#2d2d2d] text-white px-4 py-2.5 rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="customer">Customer</option>
            <option value="inventory">Inventory Manager</option>
            <option value="delivery">Delivery Staff</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead className="bg-[#131313]">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  User & Organization
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Contact Info
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Role
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Clearance & Dept
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#131313]">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-xs text-[#b0b0b0]">
                      {user.organization || 'LISM Internal'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#b0b0b0]">
                    <div className="text-white">{user.email}</div>
                    <div className="text-xs">{user.phone || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#0e97b0]/25 text-[#27c2d2] border border-[#0e97b0] capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-white">
                      {user.clearanceLevel || 'Standard Access'}
                    </div>
                    <div className="text-xs text-[#b0b0b0]">
                      {user.department || 'General'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        user.isActive
                          ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                          : 'bg-[#aa4266] text-white'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm space-x-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-[#27c2d2] hover:underline font-medium inline-flex items-center"
                    >
                      <EditIcon className="h-4 w-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`${
                        user.isActive
                          ? 'text-amber-400 hover:underline'
                          : 'text-[#4dfd88] hover:underline'
                      } font-medium inline-flex items-center`}
                    >
                      <PowerIcon className="h-4 w-4 mr-1" />
                      {user.isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-[#aa4266] hover:underline font-medium inline-flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                {editingUser ? 'Edit User Account' : 'Create New User Account'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    System Role *
                  </label>
                  <select
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as User['role'] })
                    }
                  >
                    <option value="customer">Customer (Lab Buyer)</option>
                    <option value="manager">Operations Manager</option>
                    <option value="inventory">Inventory Manager</option>
                    <option value="delivery">Delivery / Fleet Staff</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Organization / Institute
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex BioLabs"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Synthesis"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Biosafety / Hazmat Clearance Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSL-2 Verified Buyer / ADR Hazmat Certified"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.clearanceLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, clearanceLevel: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Laboratory / Delivery Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#212121]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="sp-btn-outline px-5 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-btn-primary px-6 py-2 text-sm"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
