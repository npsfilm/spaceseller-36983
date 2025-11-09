import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    setIsTransitioning(true);
    handleMove(e.clientX);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isDragging, handleMove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsTransitioning(true);
      setSliderPosition(prev => Math.max(0, prev - 5));
      setTimeout(() => setIsTransitioning(false), 300);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsTransitioning(true);
      setSliderPosition(prev => Math.min(100, prev + 5));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, []);

  // Global mouse event listeners for smooth dragging outside the slider
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none touch-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg", className)}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
    >
      {/* After Image (Background) */}
      <div className="w-full h-full">
        <img
          src={afterImage}
          alt={afterAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-md text-sm font-medium">
          Nachher
        </div>
      </div>

      {/* Before Image (Overlay with clip) */}
      <div
        className={cn("absolute inset-0 w-full h-full", isTransitioning && "transition-all duration-300")}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm font-medium">
          Vorher
        </div>
      </div>

      {/* Slider Line */}
      <div
        className={cn("absolute top-0 bottom-0 w-1 bg-background cursor-ew-resize pointer-events-none", isTransitioning && "transition-all duration-300")}
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
          <div className="flex gap-1">
            <div className="w-0.5 h-6 bg-foreground"></div>
            <div className="w-0.5 h-6 bg-foreground"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
