import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { FreelancerSidebar } from './FreelancerSidebar';

interface FreelancerLayoutProps {
  children: ReactNode;
}

export const FreelancerLayout = ({ children }: FreelancerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <FreelancerSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
