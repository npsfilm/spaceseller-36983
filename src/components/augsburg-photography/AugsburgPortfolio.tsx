import { useState } from "react";
import { Button } from "@/components/ui/button";
import apartmentLiving from "@/assets/augsburg-apartment-living.jpg";
import apartmentKitchen from "@/assets/augsburg-apartment-kitchen.jpg";
import apartmentBedroom from "@/assets/augsburg-apartment-bedroom.jpg";
import historicBuilding from "@/assets/augsburg-historic-building.jpg";
import altstadt from "@/assets/augsburg-altstadt.jpg";
import houseExterior from "@/assets/augsburg-house-exterior.jpg";
import houseInterior from "@/assets/augsburg-house-interior.jpg";
import commercial1 from "@/assets/augsburg-commercial-1.jpg";
import commercial2 from "@/assets/augsburg-commercial-2.jpg";
import aerial1 from "@/assets/augsburg-aerial-1.jpg";
import aerial2 from "@/assets/augsburg-aerial-2.jpg";
import twilight from "@/assets/augsburg-twilight.jpg";

export const AugsburgPortfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const portfolio = [
    {
      image: apartmentLiving,
      category: "apartments",
      title: "Moderne Wohnung",
      location: "Augsburg Innenstadt",
      type: "Wohnung, 85m²",
      services: "Interior",
    },
    {
      image: apartmentKitchen,
      category: "apartments",
      title: "Penthouse-Wohnung",
      location: "Augsburg Göggingen",
      type: "3-Zimmer, 110m²",
      services: "Interior",
    },
    {
      image: apartmentBedroom,
      category: "apartments",
      title: "Designerwohnung",
      location: "Augsburg Hochzoll",
      type: "2-Zimmer, 75m²",
      services: "Interior",
    },
    {
      image: historicBuilding,
      category: "houses",
      title: "Historisches Gebäude",
      location: "Augsburg Altstadt",
      type: "Mehrfamilienhaus",
      services: "Exterior",
    },
    {
      image: altstadt,
      category: "houses",
      title: "Altstadthaus",
      location: "Augsburg Zentrum",
      type: "Denkmalschutz",
      services: "Exterior",
    },
    {
      image: houseExterior,
      category: "houses",
      title: "Einfamilienhaus",
      location: "Augsburg Göggingen",
      type: "180m²",
      services: "Exterior + Interior",
    },
    {
      image: houseInterior,
      category: "houses",
      title: "Villa mit Garten",
      location: "Stadtbergen",
      type: "250m²",
      services: "Interior + Drone",
    },
    {
      image: commercial1,
      category: "commercial",
      title: "Bürogebäude",
      location: "Augsburg Business Park",
      type: "Gewerbefläche",
      services: "Exterior + Interior",
    },
    {
      image: commercial2,
      category: "commercial",
      title: "Einzelhandelsfläche",
      location: "Königsbrunn",
      type: "Ladenlokal",
      services: "Interior",
    },
    {
      image: aerial1,
      category: "aerial",
      title: "Wohngebiet",
      location: "Friedberg",
      type: "Neubaugebiet",
      services: "Drone",
    },
    {
      image: aerial2,
      category: "aerial",
      title: "Luxusvilla",
      location: "Neusäß",
      type: "Einfamilienhaus",
      services: "Drone",
    },
    {
      image: twilight,
      category: "aerial",
      title: "Traumvilla",
      location: "Augsburg Göggingen",
      type: "Luxusimmobilie",
      services: "Twilight",
    },
  ];

  const filters = [
    { id: "all", label: "Alle" },
    { id: "apartments", label: "Wohnungen" },
    { id: "houses", label: "Häuser" },
    { id: "commercial", label: "Gewerbe" },
    { id: "aerial", label: "Luftaufnahmen" },
  ];

  const filteredPortfolio =
    activeFilter === "all"
      ? portfolio
      : portfolio.filter((item) => item.category === activeFilter);

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Arbeiten in Augsburg
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Immobilienprojekte die wir in Augsburg fotografiert haben
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    📍 {item.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.type}
                  </p>
                  <div className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    {item.services}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
