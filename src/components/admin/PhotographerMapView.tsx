import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/mapbox';
import { fetchDrivingIsochrone } from '@/lib/mapbox-isochrone';

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
  const [isLoadingIsochrones, setIsLoadingIsochrones] = useState(false);

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

    map.current.on('load', async () => {
      if (!map.current) return;

      setIsLoadingIsochrones(true);

      // Fetch realistic isochrones for all photographers (max 60 min = ~100km driving)
      const isochronePromises = photographersWithLocation
        .filter((p) => p.service_radius_km)
        .map(async (p) => {
          try {
            // Always fetch the maximum realistic isochrone (cap at 100km)
            const effectiveRadius = Math.min(p.service_radius_km!, 100);
            const isochroneData = await fetchDrivingIsochrone(
              p.location_lng!,
              p.location_lat!,
              effectiveRadius,
              MAPBOX_CONFIG.accessToken
            );

            return isochroneData.features.map((feature: any) => ({
              ...feature,
              properties: {
                ...feature.properties,
                photographerId: p.id,
                name: `${p.vorname} ${p.nachname}`,
                radius: p.service_radius_km,
              },
            }));
          } catch (error) {
            console.error(`Failed to fetch isochrone for ${p.vorname}:`, error);
            return [];
          }
        });

      const isochroneResults = await Promise.all(isochronePromises);
      const isochroneFeatures = isochroneResults.flat();

      // For radii >100km, also create full-radius circles (dashed, transparent)
      const fullRadiusFeatures = photographersWithLocation
        .filter((p) => p.service_radius_km && p.service_radius_km > 100)
        .map((p) => {
          const center = turf.point([p.location_lng!, p.location_lat!]);
          const circle = turf.circle(center, p.service_radius_km!, {
            steps: 64,
            units: 'kilometers' as const,
          });
          return {
            ...circle,
            properties: {
              photographerId: p.id,
              name: `${p.vorname} ${p.nachname}`,
              radius: p.service_radius_km,
            },
          };
        });

      setIsLoadingIsochrones(false);

      // Add realistic driving-distance isochrones (solid, prominent)
      if (isochroneFeatures.length > 0) {
        map.current.addSource('service-areas-isochrones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: isochroneFeatures,
          },
        });

        map.current.addLayer({
          id: 'service-areas-fill',
          type: 'fill',
          source: 'service-areas-isochrones',
          paint: {
            'fill-color': '#264334',
            'fill-opacity': 0.25,
          },
        });

        map.current.addLayer({
          id: 'service-areas-outline',
          type: 'line',
          source: 'service-areas-isochrones',
          paint: {
            'line-color': '#264334',
            'line-width': 2.5,
          },
        });
      }

      // Add full theoretical radius circles (dashed, subtle) for large radii
      if (fullRadiusFeatures.length > 0) {
        map.current.addSource('full-radius-circles', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: fullRadiusFeatures,
          },
        });

        map.current.addLayer({
          id: 'full-radius-fill',
          type: 'fill',
          source: 'full-radius-circles',
          paint: {
            'fill-color': '#264334',
            'fill-opacity': 0.08,
          },
        });

        map.current.addLayer({
          id: 'full-radius-outline',
          type: 'line',
          source: 'full-radius-circles',
          paint: {
            'line-color': '#264334',
            'line-width': 2,
            'line-dasharray': [3, 3],
            'line-opacity': 0.5,
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

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    });

    // Cleanup function
    return () => {
      markers.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [photographers]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="w-full h-full" />
      {isLoadingIsochrones && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Berechne Service-Bereiche...</span>
          </div>
        </div>
      )}
    </div>
  );
};
