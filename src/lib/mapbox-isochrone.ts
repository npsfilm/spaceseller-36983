/**
 * Mapbox Isochrone API Integration
 * 
 * Fetches realistic service area boundaries based on driving distance/time
 * instead of simple air-distance circles.
 */

export async function fetchDrivingIsochrone(
  longitude: number,
  latitude: number,
  radiusKm: number,
  accessToken: string
): Promise<any> {
  // Convert km to estimated driving minutes (assuming 60 km/h average speed)
  const estimatedMinutes = Math.round((radiusKm / 60) * 60);
  
  // Mapbox Isochrone API supports max 60 minutes
  const minutes = Math.min(estimatedMinutes, 60);
  
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/driving/${longitude},${latitude}?contours_minutes=${minutes}&polygons=true&access_token=${accessToken}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Mapbox Isochrone API error: ${response.statusText}`);
  }
  
  return response.json();
}
