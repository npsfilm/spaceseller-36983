import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import type { OpenGraphSettings, TwitterCardSettings } from '@/types/siteSettings';

const DEFAULT_OG: OpenGraphSettings = { type: 'website', locale: 'de_DE' };
const DEFAULT_TWITTER: TwitterCardSettings = { card: 'summary_large_image' };

export const DynamicSeoHead = () => {
  const location = useLocation();
  const { siteSettings, seoSettings, getPageSeo, loading } = useSiteSettings();

  // Don't render anything while loading to avoid flash of default values
  if (loading) return null;

  // Get page-specific SEO if available
  const pageSeo = getPageSeo(location.pathname);

  // Determine values with priority: Page SEO > Global SEO > Defaults
  const title = pageSeo?.title 
    || seoSettings?.default_title 
    || 'SpaceSeller - Professionelle Immobilienfotografie';
  
  const titleSuffix = seoSettings?.title_suffix || ' | SpaceSeller';
  const fullTitle = pageSeo?.title ? `${pageSeo.title}${titleSuffix}` : title;
  
  const description = pageSeo?.description 
    || seoSettings?.default_description 
    || 'Professionelle Immobilienfotografie, Virtual Staging und Bildbearbeitung für Makler und Immobilienunternehmen.';
  
  const keywords = pageSeo?.keywords?.join(', ') 
    || seoSettings?.default_keywords?.join(', ') 
    || 'Immobilienfotografie, Virtual Staging, Bildbearbeitung';
  
  const canonicalDomain = seoSettings?.canonical_domain || 'https://spaceseller.de';
  const canonicalUrl = pageSeo?.canonical_url || `${canonicalDomain}${location.pathname}`;
  
  // Open Graph settings with proper typing
  const openGraph: OpenGraphSettings = seoSettings?.open_graph || DEFAULT_OG;
  const ogImage = pageSeo?.og_image || openGraph.image || `${canonicalDomain}/spaceseller-logo.png`;
  const ogType = openGraph.type || 'website';
  const ogLocale = openGraph.locale || 'de_DE';
  
  // Twitter Card settings with proper typing
  const twitterCard: TwitterCardSettings = seoSettings?.twitter_card || DEFAULT_TWITTER;
  const twitterCardType = twitterCard.card || 'summary_large_image';
  
  // Favicon
  const faviconUrl = siteSettings?.favicon_url || '/favicon.ico';
  
  // Robots
  const noIndex = pageSeo?.no_index || false;
  const noFollow = pageSeo?.no_follow || false;
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  // Structured Data
  const structuredData = pageSeo?.structured_data || seoSettings?.structured_data;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href={faviconUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
