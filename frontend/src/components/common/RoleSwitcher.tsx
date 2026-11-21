import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  BoxesIcon,
  TruckIcon
} from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  setCurrentRole
}) => {
  const navigate = useNavigate();
  const roles = [
    {
      id: 'admin',
      label: 'Admin',
      subtitle: 'Users, Config & Audit',
      icon: <ShieldIcon className="h-4 w-4 mr-1.5" />
    },
    {
      id: 'manager',
      label: 'Manager',
      subtitle: 'Orders, Invoices & Chat',
      icon: <BriefcaseIcon className="h-4 w-4 mr-1.5" />
    },
    {
      id: 'customer',
      label: 'Customer',
      subtitle: 'Lab Shop & Orders',
      icon: <ShoppingBagIcon className="h-4 w-4 mr-1.5" />
    },
    {
      id: 'inventory',
      label: 'Inventory Manager',
      subtitle: 'Stock, Batches & Expiry',
      icon: <BoxesIcon className="h-4 w-4 mr-1.5" />
    },
    {
      id: 'delivery',
      label: 'Delivery Staff',
      subtitle: 'Dispatch & Hazmat Fleet',
      icon: <TruckIcon className="h-4 w-4 mr-1.5" />
    }
  ];

  const handleRoleChange = (roleId: string) => {
    setCurrentRole(roleId);
    navigate(`/${roleId}`);
  };

  return (
    <div className="mb-6 bg-gray-100 p-3.5 rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Interactive Role Switcher
          </p>
          <p className="text-xs text-gray-600">
            Switch portals below to test real-time cross-role workflows:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                currentRole === role.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              title={role.subtitle}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
