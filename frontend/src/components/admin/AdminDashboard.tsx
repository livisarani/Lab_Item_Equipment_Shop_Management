import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  UsersIcon,
  PackageIcon,
  ClipboardListIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  CheckIcon
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    items,
    orders,
    notifications,
    auditLogs,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useAppContext();
  const navigate = useNavigate();

  const activeUsers = users.filter((user) => user.isActive);
  const lowStockItems = items.filter(
    (item) => item.stock <= item.lowStockThreshold
  );
  const adminNotifications = notifications.filter((n) =>
    n.forRole.includes('admin')
  );
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Enterprise overview of users, compliance audit logs, inventory alerts, and system status
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/config')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium border border-gray-300"
          >
            System Settings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-600 font-semibold">{activeUsers.length} active</span>{' '}
            • {users.length - activeUsers.length} suspended
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Catalog Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <PackageIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-amber-600 font-semibold">{lowStockItems.length} items</span>{' '}
            low on stock
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Orders & Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length} (${totalRevenue.toFixed(0)})
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {orders.filter((o) => o.status === 'pending').length} pending approval
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">System Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {adminNotifications.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircleIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {adminNotifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Directory Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User Directory & Clearance</h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All ({users.length}) →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Org
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clearance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {users.slice(0, 6).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.organization || user.email}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      {user.clearanceLevel || 'Standard'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">System Notifications</h2>
            {adminNotifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <CheckIcon className="h-3.5 w-3.5 mr-1" /> Mark all as read
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {adminNotifications.length > 0 ? (
              adminNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notifications</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Security & Compliance Audit Feed */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Recent Security & Compliance Audit Feed</h2>
          </div>
          <button
            onClick={() => navigate('/admin/audit')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Complete Audit Trail →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Target
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-medium">
                    {log.user}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{log.action}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-blue-600 font-medium">
                    {log.target}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
