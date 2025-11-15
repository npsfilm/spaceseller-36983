import { ReactNode } from "react";
import { Header } from "@/components/Header";

interface OrderLayoutProps {
  children: ReactNode;
}

export const OrderLayout = ({ children }: OrderLayoutProps) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
