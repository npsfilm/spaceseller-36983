import { Slider } from '@/components/ui/slider';

interface PhotoCountSliderProps {
  photoCount: number;
  onPhotoCountChange: (count: number) => void;
}

export const PhotoCountSlider = ({ photoCount, onPhotoCountChange }: PhotoCountSliderProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4 py-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Wie viele Fotos benötigen Sie?
        </h3>
        <p className="text-sm text-muted-foreground">
          Bewegen Sie den Schieberegler, um passende Pakete anzuzeigen
        </p>
      </div>
      
      <div className="flex items-center gap-6 px-4">
        <div className="flex-shrink-0">
          <div className="relative">
            <span className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full h-16 w-16 text-2xl shadow-lg">
              {photoCount}
            </span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              Fotos
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Slider
            value={[photoCount]}
            onValueChange={(value) => onPhotoCountChange(value[0])}
            min={6}
            max={50}
            step={1}
            className="flex-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>6</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </div>
  );
};
