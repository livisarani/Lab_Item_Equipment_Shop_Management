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
      id: 'customer',
      label: 'Customer',
      subtitle: 'Lab Shop & Requisitions',
      icon: <ShoppingBagIcon className="h-4 w-4 mr-2" />
    },
    {
      id: 'manager',
      label: 'Manager',
      subtitle: 'Orders, Invoices & Telemetry',
      icon: <BriefcaseIcon className="h-4 w-4 mr-2" />
    },
    {
      id: 'inventory',
      label: 'Inventory Manager',
      subtitle: 'Batches, Vault & Expiry',
      icon: <BoxesIcon className="h-4 w-4 mr-2" />
    },
    {
      id: 'delivery',
      label: 'Delivery Staff',
      subtitle: 'Cold-Chain & ADR Fleet',
      icon: <TruckIcon className="h-4 w-4 mr-2" />
    },
    {
      id: 'admin',
      label: 'Admin',
      subtitle: 'Users, Config & Audit',
      icon: <ShieldIcon className="h-4 w-4 mr-2" />
    }
  ];

  const handleRoleChange = (roleId: string) => {
    setCurrentRole(roleId);
    navigate(`/${roleId}`);
  };

  return (
    <div className="mb-8 bg-[#090909] p-4 rounded-[28px] border border-[#212121] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="h-9 w-9 rounded-full bg-[#0e4e65]/50 border border-[#0e97b0] flex items-center justify-center text-[#27c2d2] font-bold text-xs">
            5×
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
              Interactive Role Switcher
            </p>
            <p className="text-xs text-[#b0b0b0]">
              Switch live between all 5 LISM portals with synchronized state:
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {roles.map((role) => {
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={
                  isActive
                    ? 'sp-btn-primary px-5 py-2.5 text-sm'
                    : 'sp-btn-outline px-4 py-2 text-sm'
                }
                title={role.subtitle}
              >
                {role.icon}
                {role.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
