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
    if (!mapContainer.current || !photographers.length) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    // Calculate bounds to fit all photographers
    const bounds = new mapboxgl.LngLatBounds();
    photographers.forEach((p) => {
      if (p.location_lng && p.location_lat) {
        bounds.extend([p.location_lng, p.location_lat]);
      }
    });

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      bounds: bounds,
      fitBoundsOptions: { padding: 50 },
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add circles for service areas
      const circleFeatures = photographers
        .filter((p) => p.location_lng && p.location_lat && p.service_radius_km)
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
          'fill-color': 'hsl(var(--primary))',
          'fill-opacity': 0.15,
        },
      });

      map.current.addLayer({
        id: 'service-areas-outline',
        type: 'line',
        source: 'service-areas',
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 2,
          'line-opacity': 0.6,
        },
      });

      // Add markers for photographers
      photographers.forEach((photographer) => {
        if (!photographer.location_lng || !photographer.location_lat || !map.current) return;

        const el = document.createElement('div');
        el.className = 'photographer-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'hsl(var(--primary))';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontSize = '14px';
        el.style.fontWeight = 'bold';
        el.textContent = photographer.vorname?.charAt(0) || 'P';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">
              ${photographer.vorname} ${photographer.nachname}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              ${photographer.stadt || 'Kein Standort'}
            </div>
            <div style="font-size: 12px; color: #666;">
              Service-Radius: ${photographer.service_radius_km} km
            </div>
          </div>
          `
        );

        new mapboxgl.Marker(el)
          .setLngLat([photographer.location_lng, photographer.location_lat])
          .setPopup(popup)
          .addTo(map.current);
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [photographers]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-xl overflow-hidden border"
    />
  );
};
