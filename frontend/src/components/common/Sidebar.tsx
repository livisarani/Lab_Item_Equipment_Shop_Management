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
  ShieldCheckIcon
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
            badgeColor: 'bg-red-500'
          },
          {
            icon: <ShoppingCartIcon size={18} />,
            label: 'Orders',
            path: '/manager/orders',
            badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : undefined,
            badgeColor: 'bg-amber-500'
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
            badgeColor: 'bg-blue-500'
          }
        ];

      case 'customer':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Dashboard',
            path: '/customer'
          },
          {
            icon: <ShoppingCartIcon size={18} />,
            label: 'Shop Catalog',
            path: '/customer/shop',
            badge: cartItemsCount > 0 ? `${cartItemsCount} in cart` : undefined,
            badgeColor: 'bg-blue-500'
          },
          {
            icon: <ClipboardListIcon size={18} />,
            label: 'My Orders',
            path: '/customer/orders'
          },
          {
            icon: <MessageSquareIcon size={18} />,
            label: 'Support & SDS Help',
            path: '/customer/support'
          }
        ];

      case 'inventory':
        return [
          {
            icon: <HomeIcon size={18} />,
            label: 'Dashboard',
            path: '/inventory'
          },
          {
            icon: <PackageIcon size={18} />,
            label: 'Inventory & Batches',
            path: '/inventory/manage',
            badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined,
            badgeColor: 'bg-amber-500'
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
            label: 'Dashboard',
            path: '/delivery'
          },
          {
            icon: <TruckIcon size={18} />,
            label: 'Deliveries Queue',
            path: '/delivery/manage',
            badge: activeDeliveriesCount > 0 ? String(activeDeliveriesCount) : undefined,
            badgeColor: 'bg-blue-500'
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
    <div className="bg-blue-900 text-white w-64 flex-shrink-0 h-full flex flex-col justify-between">
      <div>
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-wide">
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Panel
            </h2>
            <ShieldCheckIcon className="h-5 w-5 text-blue-300" />
          </div>
          <p className="text-xs text-blue-300 mt-0.5">
            ISO-9001 & OSHA Lab Compliant
          </p>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1">
            {getNavItems().map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-6 py-3 hover:bg-blue-800 transition-colors ${
                      isActive
                        ? 'bg-blue-800 border-l-4 border-white font-semibold'
                        : 'text-blue-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                          item.badgeColor || 'bg-blue-600'
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

      <div className="p-4 border-t border-blue-800 text-xs text-blue-300 space-y-1">
        <p className="font-semibold text-white">LISM Safety Hotline</p>
        <p>Hazmat Dispatch: Ext. 409</p>
        <p className="text-[11px] text-blue-400">All chemical lots CoA verified</p>
      </div>
    </div>
  );
};
