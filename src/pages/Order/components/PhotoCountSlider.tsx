import { Slider } from '@/components/ui/slider';

interface PhotoCountSliderProps {
  photoCount: number;
  onPhotoCountChange: (count: number) => void;
}

export const PhotoCountSlider = ({ photoCount, onPhotoCountChange }: PhotoCountSliderProps) => {
  return (
    <div className="max-w-2xl mx-auto flex items-center gap-4">
      <div className="flex-shrink-0">
        <span className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full h-12 w-12 text-lg">
          {photoCount}
        </span>
      </div>
      <Slider
        value={[photoCount]}
        onValueChange={(value) => onPhotoCountChange(value[0])}
        min={6}
        max={50}
        step={1}
        className="flex-1"
      />
    </div>
  );
};
