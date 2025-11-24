import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PackageTier } from '@/types/photography';
import { PhotographyPackageCard } from './PhotographyPackageCard';
import { motion, AnimatePresence } from 'framer-motion';

interface PackageCarouselProps {
  packages: PackageTier[];
  selectedPackageId: string | null;
  exactMatchPackageId: string | null;
  onPackageSelect: (packageId: string) => void;
}

export const PackageCarousel = ({ packages, selectedPackageId, exactMatchPackageId, onPackageSelect }: PackageCarouselProps) => {
  return (
    <div className="max-w-6xl mx-auto px-12 py-8 pt-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={packages.map(p => p.id).join('-')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
