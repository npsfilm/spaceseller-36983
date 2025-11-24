import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PackageTier } from '@/types/photography';
import { PhotographyPackageCard } from './PhotographyPackageCard';

interface PackageCarouselProps {
  packages: PackageTier[];
  selectedPackageId: string | null;
  exactMatchPackageId: string | null;
  onPackageSelect: (packageId: string) => void;
}

export const PackageCarousel = ({ packages, selectedPackageId, exactMatchPackageId, onPackageSelect }: PackageCarouselProps) => {
  return (
    <div className="max-w-6xl mx-auto px-12 py-8 pt-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {packages.map((pkg) => (
            <CarouselItem key={pkg.id} className="md:basis-1/3">
              <PhotographyPackageCard
                packageData={pkg}
                isSelected={selectedPackageId === pkg.id}
                isExactMatch={exactMatchPackageId === pkg.id}
                onSelect={() => onPackageSelect(pkg.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
