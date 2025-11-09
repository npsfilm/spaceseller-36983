import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = "min-h-screen" }: LayoutProps) => {
  return (
    <div className={className}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
