import React, { ReactNode } from 'react';

interface DashboardProps {
  children: ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return <div className="sp-card-dark p-6 sm:p-8">{children}</div>;
};
