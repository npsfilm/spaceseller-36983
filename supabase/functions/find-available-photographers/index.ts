import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FindPhotographersRequest {
  latitude: number;
  longitude: number;
  scheduled_date?: string;
  max_distance_km?: number;
}

interface PhotographerMatch {
  photographer_id: string;
  name: string;
  email: string;
  distance_km: number;
  is_available: boolean;
  location_lat: number;
  location_lng: number;
  service_radius_km: number;
  city: string;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const {
      latitude,
      longitude,
      scheduled_date,
      max_distance_km = 100,
    }: FindPhotographersRequest = await req.json();

    // Get all photographer user_ids
    const { data: photographerRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'photographer');

    if (rolesError) {
      throw rolesError;
    }

    const photographerIds = photographerRoles?.map(r => r.user_id) || [];

    if (photographerIds.length === 0) {
      return new Response(
        JSON.stringify({ photographers: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get profiles with location data for these photographers
    const { data: photographers, error: photogError } = await supabaseClient
      .from('profiles')
      .select('id, vorname, nachname, email, location_lat, location_lng, service_radius_km, city')
      .in('id', photographerIds)
      .not('location_lat', 'is', null)
      .not('location_lng', 'is', null);

    if (photogError) {
      throw photogError;
    }

    // Calculate distances and filter by service radius
    const matches: PhotographerMatch[] = [];

    for (const profile of photographers || []) {
      const distance = calculateDistance(
        latitude,
        longitude,
        profile.location_lat,
        profile.location_lng
      );

      // Check if within photographer's service radius and max distance
      if (distance <= profile.service_radius_km && distance <= max_distance_km) {
        let isAvailable = true;

        // Check availability for specific date if provided
        if (scheduled_date) {
          const { data: availability } = await supabaseClient
            .from('photographer_availability')
            .select('is_available')
            .eq('photographer_id', profile.id)
            .eq('date', scheduled_date)
            .maybeSingle();

          // If availability record exists, use it; otherwise assume available
          if (availability) {
            isAvailable = availability.is_available;
          }
        }

        matches.push({
          photographer_id: profile.id,
          name: `${profile.vorname || ''} ${profile.nachname || ''}`.trim() || profile.email,
          email: profile.email,
          distance_km: Math.round(distance * 10) / 10,
          is_available: isAvailable,
          location_lat: profile.location_lat,
          location_lng: profile.location_lng,
          service_radius_km: profile.service_radius_km,
          city: profile.city || 'Unknown',
        });
      }
    }

    // Sort by distance
    matches.sort((a, b) => a.distance_km - b.distance_km);

    return new Response(
      JSON.stringify({ photographers: matches }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
