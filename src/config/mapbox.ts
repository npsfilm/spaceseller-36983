/**
 * Mapbox Configuration
 * 
 * Get your Mapbox public token at: https://account.mapbox.com/access-tokens
 * 
 * Note: Mapbox public tokens are designed for client-side use and are 
 * domain-restricted for security. It's safe to include them in your codebase.
 */

export const MAPBOX_CONFIG = {
  // Replace 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE' with your actual Mapbox public token
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidGhlb2xkYXZlbmdlciIsImEiOiJja2k3N2x3dXo0dXc1MnBrejJydnk0Nmk0In0.y91TjGaxiVvnAX4VTIotug',
  
  // Base address for calculating travel costs
  baseAddress: "Klinkerberg 9, 86152 Augsburg",
  
  // Pricing configuration
  costPerKm: 0.65,
  costPerKmOver200: 0.85,
  freeTravelThreshold: 20,
};
