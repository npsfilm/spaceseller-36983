import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/mapbox';

interface Photographer {
  id: string;
  vorname: string | null;
  nachname: string | null;
  email: string;
  stadt: string | null;
  location_lat: number | null;
  location_lng: number | null;
  service_radius_km: number | null;
}

interface PhotographerMapViewProps {
  photographers: Photographer[];
}

export const PhotographerMapView = ({ photographers }: PhotographerMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const photographersWithLocation = photographers.filter(
      (p) => p.location_lng && p.location_lat
    );

    if (!photographersWithLocation.length) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    // Calculate bounds to fit all photographers
    const bounds = new mapboxgl.LngLatBounds();
    photographersWithLocation.forEach((p) => {
      bounds.extend([p.location_lng!, p.location_lat!]);
    });

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      bounds: bounds,
      fitBoundsOptions: { padding: 100 },
    });

    const markers: mapboxgl.Marker[] = [];

    map.current.on('load', () => {
      if (!map.current) return;

      // Add circles for service areas
      const circleFeatures = photographersWithLocation
        .filter((p) => p.service_radius_km)
        .map((p) => {
          const center = turf.point([p.location_lng!, p.location_lat!]);
          const radius = p.service_radius_km!;
          const options = { steps: 64, units: 'kilometers' as const };
          const circle = turf.circle(center, radius, options);
          
          return {
            ...circle,
            properties: {
              photographerId: p.id,
              name: `${p.vorname} ${p.nachname}`,
              radius: radius,
            },
          };
        });

      if (circleFeatures.length > 0) {
        map.current.addSource('service-areas', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: circleFeatures,
          },
        });

        map.current.addLayer({
          id: 'service-areas-fill',
          type: 'fill',
          source: 'service-areas',
          paint: {
            'fill-color': '#264334',
            'fill-opacity': 0.1,
          },
        });

        map.current.addLayer({
          id: 'service-areas-outline',
          type: 'line',
          source: 'service-areas',
          paint: {
            'line-color': '#264334',
            'line-width': 2,
            'line-opacity': 0.4,
          },
        });
      }

      // Add markers for photographers
      photographersWithLocation.forEach((photographer) => {
        if (!map.current) return;

        const el = document.createElement('div');
        el.className = 'photographer-marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#264334';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 12px rgba(38, 67, 52, 0.3)';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontSize = '16px';
        el.style.fontWeight = 'bold';
        el.textContent = photographer.vorname?.charAt(0) || 'P';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `
          <div style="padding: 12px;">
            <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">
              ${photographer.vorname} ${photographer.nachname}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              📍 ${photographer.stadt || 'Kein Standort'}
            </div>
            <div style="font-size: 12px; color: #264334; font-weight: 600;">
              Radius: ${photographer.service_radius_km || 50} km
            </div>
          </div>
          `
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([photographer.location_lng!, photographer.location_lat!])
          .setPopup(popup)
          .addTo(map.current);

        markers.push(marker);
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      markers.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [photographers]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-xl overflow-hidden border"
    />
  );
};
