import { useState } from "react";
import { Button } from "@/components/ui/button";
import apartmentLiving from "@/assets/munich-apartment-living.jpg";
import apartmentKitchen from "@/assets/munich-apartment-kitchen.jpg";
import apartmentBedroom from "@/assets/munich-apartment-bedroom.jpg";
import villaExterior from "@/assets/munich-villa-exterior.jpg";
import villaInterior from "@/assets/munich-villa-interior.jpg";
import penthouseTerrace from "@/assets/munich-penthouse-terrace.jpg";
import historicBuilding from "@/assets/munich-historic-building.jpg";
import modernApartment from "@/assets/munich-modern-apartment.jpg";
import commercialOffice from "@/assets/munich-commercial-office.jpg";
import aerialSkyline from "@/assets/munich-aerial-skyline.jpg";
import aerialResidential from "@/assets/munich-aerial-residential.jpg";
import twilight from "@/assets/munich-twilight.jpg";

export const MunichPortfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const portfolioItems = [
    {
      image: apartmentLiving,
      title: "Luxus-Apartment",
      location: "München-Schwabing",
      type: "Wohnung, 120m²",
      services: "Interior + Exterior",
      category: "apartments",
    },
    {
      image: apartmentKitchen,
      title: "Designer-Küche",
      location: "München-Maxvorstadt",
      type: "Wohnung, 95m²",
      services: "Interior",
      category: "apartments",
    },
    {
      image: apartmentBedroom,
      title: "Penthouse-Schlafzimmer",
      location: "München-Bogenhausen",
      type: "Penthouse, 180m²",
      services: "Interior mit Cityview",
      category: "luxury",
    },
    {
      image: villaExterior,
      title: "Moderne Villa",
      location: "Grünwald",
      type: "Villa, 280m²",
      services: "Exterior + Drone",
      category: "houses",
    },
    {
      image: villaInterior,
      title: "Luxus-Villa Innenraum",
      location: "München-Nymphenburg",
      type: "Villa, 320m²",
      services: "Interior Premium",
      category: "luxury",
    },
    {
      image: penthouseTerrace,
      title: "Penthouse Dachterrasse",
      location: "München-Schwabing",
      type: "Penthouse, 200m²",
      services: "Twilight + Exterior",
      category: "luxury",
    },
    {
      image: historicBuilding,
      title: "Historisches Altbau-Gebäude",
      location: "München-Altstadt",
      type: "Mehrfamilienhaus",
      services: "Exterior",
      category: "houses",
    },
    {
      image: modernApartment,
      title: "Moderne City-Wohnung",
      location: "München-Haidhausen",
      type: "Wohnung, 85m²",
      services: "Interior",
      category: "apartments",
    },
    {
      image: commercialOffice,
      title: "Premium Office Space",
      location: "München-Maxvorstadt",
      type: "Bürofläche, 250m²",
      services: "Commercial Photography",
      category: "commercial",
    },
    {
      image: aerialSkyline,
      title: "München Skyline",
      location: "München-Stadtgebiet",
      type: "Luftaufnahme",
      services: "Drone Photography",
      category: "aerial",
    },
    {
      image: aerialResidential,
      title: "Wohngebiet von oben",
      location: "München-Trudering",
      type: "Luftaufnahme",
      services: "Drone Photography",
      category: "aerial",
    },
    {
      image: twilight,
      title: "Villa bei Dämmerung",
      location: "Pullach",
      type: "Villa, 250m²",
      services: "Twilight Photography",
      category: "luxury",
    },
  ];

  const filters = [
    { id: "all", label: "Alle" },
    { id: "apartments", label: "Wohnungen" },
    { id: "houses", label: "Häuser" },
    { id: "luxury", label: "Luxus" },
    { id: "commercial", label: "Gewerbe" },
    { id: "aerial", label: "Luftaufnahmen" },
  ];

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Unsere Arbeiten in München</h2>
          <p className="text-xl text-muted-foreground">
            Immobilienprojekte die wir in München fotografiert haben
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="min-w-[100px]"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90 mb-1">📍 {item.location}</p>
                <p className="text-sm opacity-90 mb-1">{item.type}</p>
                <p className="text-sm text-accent font-medium">{item.services}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
