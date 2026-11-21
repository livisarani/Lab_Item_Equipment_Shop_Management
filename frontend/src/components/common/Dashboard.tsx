import React, { ReactNode } from 'react';

interface DashboardProps {
  children: ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>;
};
