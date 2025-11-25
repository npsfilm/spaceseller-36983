import { ReactNode } from 'react';
import { FreelancerHeader } from './FreelancerHeader';
import { FreelancerSidebar } from './FreelancerSidebar';

interface FreelancerLayoutProps {
  children: ReactNode;
}

export const FreelancerLayout = ({ children }: FreelancerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <FreelancerHeader />
      <div className="flex flex-1">
        <FreelancerSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
