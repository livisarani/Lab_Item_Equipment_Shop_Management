import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  BellIcon,
  ShoppingCartIcon,
  FlaskConicalIcon,
  CheckIcon,
  UserCheckIcon,
  ShieldAlertIcon
} from 'lucide-react';

interface HeaderProps {
  currentRole?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRole = 'customer' }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    cart,
    systemConfig,
    users
  } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const roleNotifications = notifications.filter((n) =>
    n.forRole.includes(currentRole)
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeUserForRole =
    users.find((u) => u.role === currentRole) || users[0];

  return (
    <header className="bg-white shadow-sm py-3.5 px-6 border-b border-gray-200 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-800 text-white p-2 rounded-lg flex items-center justify-center shadow-sm">
            <FlaskConicalIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-blue-900 tracking-tight">
                LISM
              </h1>
              <span className="hidden sm:inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-200">
                v2.4 Enterprise
              </span>
              {systemConfig.maintenanceMode && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded flex items-center">
                  <ShieldAlertIcon className="h-3.5 w-3.5 mr-1" /> Maintenance Mode
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs">
              {systemConfig.siteName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          {/* Active Role User Profile Badge */}
          <div className="hidden md:flex items-center space-x-2.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <UserCheckIcon className="h-4 w-4 text-blue-600" />
            <div className="text-xs">
              <p className="font-semibold text-gray-800 leading-tight">
                {activeUserForRole?.name}
              </p>
              <p className="text-gray-500 capitalize">
                {activeUserForRole?.department || activeUserForRole?.organization || `${currentRole} Portal`}
              </p>
            </div>
          </div>

          {/* Quick Cart Button for Customer */}
          {currentRole === 'customer' && (
            <button
              onClick={() => navigate('/customer/shop')}
              className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
              title="View Shopping Cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Notification Bell & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              title="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">
                      Notifications ({roleNotifications.length})
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      Filtered for {currentRole} role
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <CheckIcon className="h-3.5 w-3.5 mr-1" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {roleNotifications.length > 0 ? (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                          !notif.read ? 'bg-blue-50/60' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              notif.type === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : notif.type === 'error'
                                ? 'bg-red-100 text-red-800'
                                : notif.type === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {notif.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 mt-1.5">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No notifications for this role
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
