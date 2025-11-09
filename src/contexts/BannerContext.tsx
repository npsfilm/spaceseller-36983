import { createContext, useContext, useState, ReactNode } from "react";

interface BannerContextType {
  isBannerVisible: boolean;
  userDismissed: boolean;
  scrollHidden: boolean;
  dismissBanner: () => void;
  setScrollHidden: (hidden: boolean) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [userDismissed, setUserDismissed] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);

  const dismissBanner = () => {
    setUserDismissed(true);
  };

  const isBannerVisible = !userDismissed && !scrollHidden;

  return (
    <BannerContext.Provider value={{ 
      isBannerVisible, 
      userDismissed, 
      scrollHidden, 
      dismissBanner, 
      setScrollHidden 
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBannerContext = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBannerContext must be used within a BannerProvider");
  }
  return context;
};
