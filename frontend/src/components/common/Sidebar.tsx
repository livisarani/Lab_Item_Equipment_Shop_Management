import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  TruckIcon,
  HomeIcon,
  ClipboardListIcon,
  SettingsIcon,
  BarChartIcon,
  MessageSquareIcon,
  ActivityIcon
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole }) => {
  const location = useLocation();
  const { orders, items, conversations, cart } = useAppContext();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = items.filter((i) => i.stock <= i.lowStockThreshold).length;
  const unreadMessagesCount = conversations.filter((c) => c.unread).length;
  const activeDeliveriesCount = orders.filter(
    (o) =>
      o.fulfillmentOption === 'delivery' &&
      ['pending', 'processing', 'in-transit'].includes(o.status)
  ).length;
  const cartItemsCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Dashboard',
            path: '/admin'
          },
          {
            icon: <UsersIcon size={18} />,
            label: 'User Management',
            path: '/admin/users'
          },
          {
            icon: <SettingsIcon size={18} />,
            label: 'System Configuration',
            path: '/admin/config'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'Audit Trails',
            path: '/admin/audit'
          }
        ];

      case 'manager':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Dashboard',
            path: '/manager'
          },
          {
            icon: <PackageIcon size={18} />,
            label: 'Item Availability',
            path: '/manager/items',
            badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
            badgeColor: 'bg-[#aa4266]'
          },
          {
            icon: <ShoppingCartIcon size={18} />,
            label: 'Orders',
            path: '/manager/orders',
            badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : undefined,
            badgeColor: 'bg-[#0e97b0]'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'Invoices',
            path: '/manager/invoices'
          },
          {
            icon: <BarChartIcon size={18} />,
            label: 'Reports',
            path: '/manager/reports'
          },
          {
            icon: <MessageSquareIcon size={18} />,
            label: 'Messages',
            path: '/manager/messages',
            badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined,
            badgeColor: 'bg-[#0f9b40]'
          }
        ];

      case 'customer':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Overview & Hero',
            path: '/customer'
          },
          {
            icon: <ShoppingCartIcon size={18} />,
            label: 'Lab Catalog',
            path: '/customer/shop',
            badge: cartItemsCount > 0 ? `${cartItemsCount} in cart` : undefined,
            badgeColor: 'bg-[#0e97b0]'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'My Orders',
            path: '/customer/orders'
          },
          {
            icon: <MessageSquareIcon size={18} />,
            label: 'R&D & SDS Support',
            path: '/customer/support'
          }
        ];

      case 'inventory':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Vault Dashboard',
            path: '/inventory'
          },
          {
            icon: <PackageIcon size={18} />,
            label: 'Inventory & Batches',
            path: '/inventory/manage',
            badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined,
            badgeColor: 'bg-[#aa4266]'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'Stock Reports',
            path: '/inventory/reports'
          }
        ];

      case 'delivery':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Fleet Dashboard',
            path: '/delivery'
          },
          {
            icon: <TruckIcon size={18} />,
            label: 'Deliveries Queue',
            path: '/delivery/manage',
            badge: activeDeliveriesCount > 0 ? String(activeDeliveriesCount) : undefined,
            badgeColor: 'bg-[#0e97b0]'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'Delivery Reports',
            path: '/delivery/reports'
          }
        ];

      default:
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Dashboard',
            path: '/customer'
          }
        ];
    }
  };

  return (
    <aside className="bg-[#090909] text-white w-64 flex-shrink-0 border-r border-[#212121] hidden md:flex flex-col justify-between">
      <div>
        <div className="p-5 border-b border-[#212121]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
              {currentRole} module
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#4dfd88] animate-pulse" title="Real-Time Telemetry Active" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white mt-1 font-display">
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Control
          </h2>
          <p className="text-xs text-[#b0b0b0] mt-0.5">
            GMP Annex 1 • ISO-9001 • 21 CFR
          </p>
        </div>

        <nav className="p-3">
          <ul className="space-y-1.5">
            {getNavItems().map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0e97b0] text-white font-semibold shadow-lg'
                        : 'text-[#b0b0b0] hover:bg-[#131313] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`mr-3 h-8 w-8 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-black/30 text-white'
                            : 'bg-[#131313] text-[#27c2d2]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white ${
                          item.badgeColor || 'bg-[#0e97b0]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Real-Time Incubator / Lab Status Card */}
      <div className="p-4 m-3 rounded-[24px] bg-[#131313] border border-[#212121] text-xs space-y-2">
        <div className="flex items-center space-x-2 text-[#27c2d2] font-semibold">
          <ActivityIcon className="h-4 w-4" />
          <span>Real-Time Lab Monitor</span>
        </div>
        <p className="text-[#b0b0b0] leading-relaxed">
          Vault Temp: <strong className="text-white">18.4°C</strong> • Cold-Chain:{' '}
          <strong className="text-[#4dfd88]">Nominal</strong>
        </p>
        <p className="text-[11px] text-[#888]">
          All chemical lots CoA & SDS verified
        </p>
      </div>
    </aside>
  );
};
