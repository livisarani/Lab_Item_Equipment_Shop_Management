import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  BellIcon,
  ShoppingCartIcon,
  CheckIcon,
  ChevronDownIcon,
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
    users,
    setCurrentRole
  } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const roleNotifications = notifications.filter((n) =>
    n.forRole.includes(currentRole)
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeUserForRole =
    users.find((u) => u.role === currentRole) || users[0];

  const getHeaderNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { label: 'Home', path: '/admin' },
          { label: 'User Management', path: '/admin/users' },
          { label: 'System Config', path: '/admin/config' },
          { label: 'Audit Trails', path: '/admin/audit' }
        ];
      case 'manager':
        return [
          { label: 'Home', path: '/manager' },
          { label: 'Item Availability', path: '/manager/items' },
          { label: 'Orders', path: '/manager/orders' },
          { label: 'Invoices', path: '/manager/invoices' },
          { label: 'Reports', path: '/manager/reports' },
          { label: 'Messages', path: '/manager/messages' }
        ];
      case 'customer':
        return [
          { label: 'Home', path: '/customer' },
          { label: 'Environmental & Lab Shop', path: '/customer/shop' },
          { label: 'My Orders & QC', path: '/customer/orders' },
          { label: 'R&D Support', path: '/customer/support' }
        ];
      case 'inventory':
        return [
          { label: 'Home', path: '/inventory' },
          { label: 'Batch & Stock Vault', path: '/inventory/manage' },
          { label: 'Stock Reports', path: '/inventory/reports' }
        ];
      case 'delivery':
        return [
          { label: 'Home', path: '/delivery' },
          { label: 'Hazmat Dispatch', path: '/delivery/manage' },
          { label: 'Logistics Reports', path: '/delivery/reports' }
        ];
      default:
        return [{ label: 'Home', path: '/customer' }];
    }
  };

  const rolesList = [
    { id: 'customer', label: 'Customer Portal' },
    { id: 'manager', label: 'Manager Portal' },
    { id: 'inventory', label: 'Inventory Portal' },
    { id: 'delivery', label: 'Delivery Portal' },
    { id: 'admin', label: 'Admin Portal' }
  ];

  const handlePrimaryCta = () => {
    if (currentRole === 'customer') navigate('/customer/shop');
    else if (currentRole === 'manager') navigate('/manager/orders');
    else if (currentRole === 'inventory') navigate('/inventory/manage');
    else if (currentRole === 'delivery') navigate('/delivery/manage');
    else navigate('/admin/users');
  };

  const getPrimaryCtaLabel = () => {
    if (currentRole === 'customer') return cartCount > 0 ? `Checkout (${cartCount})` : 'Book your order';
    if (currentRole === 'manager') return 'Process orders';
    if (currentRole === 'inventory') return 'Manage batches';
    if (currentRole === 'delivery') return 'Dispatch queue';
    return 'Manage users';
  };

  return (
    <header className="sp-header-gradient sticky top-0 z-50 h-20 md:h-24 px-4 md:px-10 shadow-lg transition-all">
      <div className="max-w-[1440px] mx-auto h-full flex justify-between items-center gap-4">
        {/* Left: ScanStation-inspired Molecular Dot Brand Lockup */}
        <Link
          to={`/${currentRole}`}
          className="flex items-center space-x-3 group focus:outline-none"
        >
          <svg
            width="48"
            height="34"
            viewBox="0 0 64 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            {/* Molecular Petri-dish dot cluster matching brand-logo.png */}
            <ellipse cx="14" cy="24" rx="5.5" ry="3.2" fill="#ffffff" />
            <ellipse cx="22" cy="18" rx="4" ry="2.4" fill="#ffffff" opacity="0.9" />
            <ellipse cx="11" cy="32" rx="7" ry="4" fill="#ffffff" />
            <ellipse cx="24" cy="36" rx="8.5" ry="4.8" fill="#ffffff" />
            <ellipse cx="38" cy="33" rx="6.5" ry="3.8" fill="#ffffff" />
            <circle cx="48" cy="14" r="3" fill="#000000" />
          </svg>
          <div className="leading-none">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl md:text-[30px] font-light tracking-tight text-white font-sans">
                LISM<span className="font-bold">Station</span>
              </span>
              {systemConfig.maintenanceMode && (
                <span className="bg-[#aa4266] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <ShieldAlertIcon className="h-3 w-3 mr-1" /> Maintenance
                </span>
              )}
            </div>
            <span className="block text-[11px] md:text-xs tracking-[0.18em] text-white/90 font-light lowercase text-right">
              interscience lab
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links (myscanstation.com .button-outline-sm & .nav-link-plain) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {getHeaderNavItems().map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={
                  isActive
                    ? 'sp-nav-pill-active'
                    : 'sp-nav-link'
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Role Switcher (.language-switch), Cart, Notifications & Black Ink CTA (.button-ink) */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Role / Portal Switcher styled after myscanstation Language Switch */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-black hover:text-white transition-colors cursor-pointer"
              title="Switch Role Portal"
            >
              <span className="capitalize font-semibold">{currentRole}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#090909] border border-[#212121] rounded-[20px] shadow-2xl py-2 z-50 text-white">
                <div className="px-4 py-1.5 text-[11px] text-[#b0b0b0] uppercase tracking-wider border-b border-[#212121]">
                  {activeUserForRole?.name}
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRole(r.id);
                      navigate(`/${r.id}`);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      currentRole === r.id
                        ? 'text-[#27c2d2] font-bold bg-[#131313]'
                        : 'text-white hover:bg-[#131313] hover:text-[#27c2d2]'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentRole === r.id && (
                      <span className="h-2 w-2 rounded-full bg-[#27c2d2]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Cart Button for Customer */}
          {currentRole === 'customer' && (
            <button
              onClick={() => navigate('/customer/shop')}
              className="relative h-11 w-11 rounded-full border border-white/40 bg-black/20 text-white hover:bg-black hover:border-black transition-all flex items-center justify-center"
              title="View Shopping Cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#aa4266] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Notification Bell & Obsidian Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative h-11 w-11 rounded-full border border-white/40 bg-black/20 text-white hover:bg-black hover:border-black transition-all flex items-center justify-center focus:outline-none"
              title="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#aa4266] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#090909] rounded-[24px] shadow-2xl border border-[#212121] z-50 overflow-hidden text-white">
                <div className="p-4 bg-[#131313] border-b border-[#212121] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Lab Telemetry & Alerts ({roleNotifications.length})
                    </h3>
                    <p className="text-xs text-[#b0b0b0] capitalize">
                      Active channel: {currentRole}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#27c2d2] hover:underline font-medium flex items-center"
                    >
                      <CheckIcon className="h-3.5 w-3.5 mr-1" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#212121]">
                  {roleNotifications.length > 0 ? (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-4 cursor-pointer hover:bg-[#131313] transition-colors ${
                          !notif.read ? 'bg-[#0e4e65]/25' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              notif.type === 'warning' || notif.type === 'error'
                                ? 'bg-[#aa4266] text-white'
                                : notif.type === 'success'
                                ? 'bg-[#0f9b40] text-white'
                                : 'bg-[#0e97b0] text-white'
                            }`}
                          >
                            {notif.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-[#b0b0b0]">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-[#b0b0b0] mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[#b0b0b0] text-sm">
                      No notifications for this role
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Signature Black Ink Header Button (.button-ink from components.css) */}
          <button
            onClick={handlePrimaryCta}
            className="hidden sm:inline-flex sp-btn-ink h-[50px] px-7 text-[16px]"
          >
            {getPrimaryCtaLabel()}
          </button>
        </div>
      </div>
    </header>
  );
};
