import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  UsersIcon,
  PackageIcon,
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
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            System Telemetry & Governance
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Enterprise overview of users, 21 CFR Part 11 audit logs, inventory alerts, and system status
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/users')}
            className="sp-btn-primary h-[48px] px-7 text-sm"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/config')}
            className="sp-btn-outline h-[48px] px-6 text-sm"
          >
            System Settings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Total Users
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {users.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <UsersIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            <span className="text-[#4dfd88] font-bold">{activeUsers.length} active</span>{' '}
            • {users.length - activeUsers.length} suspended
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Catalog Items
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {items.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0f9b40] text-white flex items-center justify-center shadow-lg">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            <span className="text-[#aa4266] font-bold">{lowStockItems.length} items</span>{' '}
            low on stock
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Orders & Volume
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {orders.length} (${totalRevenue.toFixed(0)})
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0e97b0] text-white flex items-center justify-center shadow-lg">
              <DollarSignIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            {orders.filter((o) => o.status === 'pending').length} pending approval
          </p>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                System Alerts
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {adminNotifications.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <AlertCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            {adminNotifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Directory Overview */}
        <div className="sp-card-dark p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-display">
              User Directory & Clearance
            </h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm text-[#27c2d2] hover:underline font-medium"
            >
              View All ({users.length}) →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#212121] text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Name & Org
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Clearance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#212121]">
                {users.slice(0, 6).map((user) => (
                  <tr key={user.id} className="hover:bg-[#131313]">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-[#b0b0b0]">
                        {user.organization || user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#0e97b0]/25 text-[#27c2d2] border border-[#0e97b0]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[#b0b0b0]">
                      {user.clearanceLevel || 'Standard'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${
                          user.isActive
                            ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                            : 'bg-[#aa4266] text-white'
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
        <div className="sp-card-dark p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-display">
              System Notifications
            </h2>
            {adminNotifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#27c2d2] hover:underline font-medium flex items-center"
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
                  className={`p-4 rounded-[20px] border cursor-pointer transition ${
                    notification.read
                      ? 'bg-[#131313] border-[#212121]'
                      : 'bg-[#0e4e65]/30 border-[#0e97b0]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-white">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-[#b0b0b0]">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#b0b0b0] mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#b0b0b0] text-sm">No notifications</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Security & Compliance Audit Feed */}
      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2.5">
            <ShieldCheckIcon className="h-6 w-6 text-[#27c2d2]" />
            <h2 className="text-xl font-bold text-white font-display">
              Recent Security & Compliance Audit Feed
            </h2>
          </div>
          <button
            onClick={() => navigate('/admin/audit')}
            className="text-sm text-[#27c2d2] hover:underline font-medium"
          >
            View Complete Audit Trail →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Actor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Target
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {auditLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-[#131313]">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#b0b0b0]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-white">
                    {log.user}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#27c2d2] font-semibold">
                    {log.target}
                  </td>
                  <td className="px-4 py-3 text-[#b0b0b0] text-xs">
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
