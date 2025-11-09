import { useState, useEffect } from "react";

export const useScrollBehavior = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      
      // Detect scroll direction
      setIsScrollingUp(currentScrollY < lastScrollY);
      
      // Detect if scrolled past hero (300px threshold)
      setIsScrolledPastHero(currentScrollY > 300);
      
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollY, isScrollingUp, isScrolledPastHero };
};
