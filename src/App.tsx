import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BannerProvider } from "./contexts/BannerContext";
import Index from "./pages/Index";
import Immobilienmakler from "./pages/Immobilienmakler";
import Grundrisse from "./pages/Grundrisse";
import VirtualStaging from "./pages/VirtualStaging";
import ImmobilienfotografWhitelabel from "./pages/ImmobilienfotografWhitelabel";
import ImmobilienfotografieAugsburg from "./pages/ImmobilienfotografieAugsburg";
import ImmobilienfotografieMuenchen from "./pages/ImmobilienfotografieMuenchen";
import Immobilienfotografie from "./pages/Immobilienfotografie";
import FotografenWerden from "./pages/FotografenWerden";
import AngebotImmobilienmakler from "./pages/AngebotImmobilienmakler";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BannerProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Immobilienmakler" element={<Immobilienmakler />} />
          <Route path="/grundrisse" element={<Grundrisse />} />
          <Route path="/virtual-staging" element={<VirtualStaging />} />
          <Route path="/immobilienfotograf-whitelabel" element={<ImmobilienfotografWhitelabel />} />
          <Route path="/immobilienfotografie-augsburg" element={<ImmobilienfotografieAugsburg />} />
          <Route path="/immobilienfotografie-muenchen" element={<ImmobilienfotografieMuenchen />} />
          <Route path="/immobilienfotografie" element={<Immobilienfotografie />} />
          <Route path="/fotografen-werden" element={<FotografenWerden />} />
          <Route path="/angebot-immobilienmakler" element={<AngebotImmobilienmakler />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BannerProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
