# Production Deployment Checklist

This checklist ensures all critical systems are configured and tested before launching the spaceseller platform to production.

## Security Configuration

### Authentication & Authorization
- [ ] Leaked password protection enabled in Supabase Auth settings
- [ ] Rate limiting verified on all edge functions (5 requests per 15 minutes)
- [ ] Password reset tokens expire after 60 minutes
- [ ] JWT tokens configured with appropriate expiration
- [ ] All RLS policies tested with multiple user roles (admin, client, photographer)
- [ ] Session management configured securely
- [ ] CORS policies configured correctly for production domain

### Edge Function Security
- [ ] All edge functions use SECURITY DEFINER where appropriate
- [ ] Input validation with Zod schemas on all edge functions
- [ ] Rate limiting implemented on public endpoints
- [ ] Sensitive data scrubbed from error messages
- [ ] No console.log statements in production code
- [ ] All secrets configured in Supabase secrets (not in code)

### Database Security
- [ ] RLS enabled on all tables
- [ ] RLS policies tested for privilege escalation vulnerabilities
- [ ] No direct access to auth.users table
- [ ] Database functions use appropriate SECURITY DEFINER
- [ ] Foreign key constraints properly configured
- [ ] Indexes created for performance-critical queries

## GDPR Compliance

- [ ] User data export functionality tested
- [ ] Account deletion with cascade cleanup verified
- [ ] Data retention policies configured (cleanup_old_orders runs daily)
- [ ] Consent management UI accessible to all users
- [ ] Privacy policy updated with accurate data processing information
- [ ] Cookie consent banner implemented (if using cookies)
- [ ] Data processing agreements signed with third parties

## Email & Communication

- [ ] Custom email domain configured (noreply@updates.spaceseller.de)
- [ ] SPF records configured for email authentication
- [ ] DKIM records configured for email authentication
- [ ] DMARC policy configured
- [ ] Password reset emails tested and delivered successfully
- [ ] Email templates reviewed for branding consistency
- [ ] Resend API key configured and tested
- [ ] Email deliverability monitored

## Infrastructure & Monitoring

### Domain & SSL
- [ ] Custom domain (app.spaceseller.de) configured
- [ ] SSL certificate installed and auto-renewal configured
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] DNS records properly configured (A, AAAA, CNAME)

### Monitoring & Alerts
- [ ] Health check endpoint (/health-check) configured
- [ ] Metrics endpoint (/metrics) configured for admin access
- [ ] Uptime monitoring service configured (UptimeRobot, Better Stack, etc.)
- [ ] Error tracking service integrated (error tracking setup in main.tsx)
- [ ] Alert notifications configured for:
  - [ ] Service downtime
  - [ ] Rate limit violations
  - [ ] Failed authentication attempts
  - [ ] Database connection issues
  - [ ] Storage quota warnings

### Logging
- [ ] Structured logging implemented in all edge functions
- [ ] Security events logged (auth attempts, rate limits, GDPR actions)
- [ ] Log retention policy configured
- [ ] Admin security monitor dashboard accessible

## Performance & Optimization

- [ ] Database query performance profiled
- [ ] Indexes added for frequently queried columns
- [ ] Image optimization configured (if applicable)
- [ ] CDN configured for static assets
- [ ] Bundle size optimized (code splitting, lazy loading)
- [ ] Lighthouse performance score > 90
- [ ] Core Web Vitals meet targets (LCP, FID, CLS)

## Backup & Recovery

- [ ] Database backup strategy implemented
- [ ] Backup restoration tested successfully
- [ ] Point-in-time recovery (PITR) configured
- [ ] Storage bucket backup configured
- [ ] Disaster recovery plan documented
- [ ] RTO (Recovery Time Objective) defined
- [ ] RPO (Recovery Point Objective) defined

## Testing

### Functional Testing
- [ ] User registration and onboarding flow tested
- [ ] Order creation flow tested for all service categories
- [ ] Payment processing tested (if applicable)
- [ ] Photographer assignment workflow tested
- [ ] File upload and deliverable download tested
- [ ] Admin dashboard features tested
- [ ] Photographer dashboard features tested

### Security Testing
- [ ] SQL injection testing completed
- [ ] XSS (Cross-Site Scripting) testing completed
- [ ] CSRF (Cross-Site Request Forgery) protection verified
- [ ] Authentication bypass attempts tested
- [ ] Authorization bypass attempts tested
- [ ] Rate limiting bypass attempts tested
- [ ] File upload validation tested (type, size, content)

### Load Testing
- [ ] Load testing completed with expected traffic patterns
- [ ] Stress testing completed (2x expected load)
- [ ] Database connection pool sizing verified
- [ ] API response times under load measured
- [ ] Edge function cold start times acceptable
- [ ] Concurrent user limit tested

### Integration Testing
- [ ] Complete order flow integration test passed
- [ ] Mapbox API integration tested
- [ ] Email sending integration tested
- [ ] Zapier webhook integration tested (if applicable)
- [ ] Storage upload/download integration tested

## Documentation

- [ ] API documentation up to date
- [ ] Environment variables documented
- [ ] Deployment procedures documented
- [ ] Rollback procedures documented
- [ ] Incident response plan documented
- [ ] User guides created for all roles
- [ ] Admin training materials prepared

## Legal & Compliance

- [ ] Terms of Service (AGB) reviewed by legal counsel
- [ ] Privacy Policy (Datenschutz) compliant with GDPR
- [ ] Impressum (legal notice) contains all required information
- [ ] Cookie policy documented (if applicable)
- [ ] Data processing agreements signed with vendors
- [ ] GDPR compliance audit completed

## Pre-Launch

- [ ] Production environment variables configured
- [ ] All third-party API keys rotated to production keys
- [ ] Database migration tested on production-like environment
- [ ] Staging environment mirrors production configuration
- [ ] Team trained on production deployment process
- [ ] Customer support team briefed on launch
- [ ] Marketing materials reviewed and approved
- [ ] Soft launch plan prepared (limited user access)

## Post-Launch

- [ ] Monitor logs for first 24 hours continuously
- [ ] Track error rates and performance metrics
- [ ] User feedback collection process active
- [ ] Support ticket system configured
- [ ] Post-launch review scheduled (1 week after launch)
- [ ] Performance optimization opportunities identified

---

## Emergency Contacts

**Technical Lead:** [Name] - [Email] - [Phone]  
**Database Admin:** [Name] - [Email] - [Phone]  
**Security Contact:** [Name] - [Email] - [Phone]  
**Supabase Support:** support@supabase.com  
**Hosting Provider:** [Contact Info]

## Rollback Plan

In case of critical issues after deployment:

1. **Database Rollback:**
   - Restore from latest PITR backup
   - Command: `supabase db restore --ref [project-id] --backup-id [backup-id]`

2. **Code Rollback:**
   - Revert to previous stable git commit
   - Redeploy edge functions from previous version

3. **Communication:**
   - Notify users via status page
   - Post in user notification system
   - Email critical clients if necessary

## Sign-off

- [ ] Technical Lead approval
- [ ] Security review completed
- [ ] Legal compliance verified
- [ ] Business stakeholder approval
- [ ] Final go/no-go decision made

**Deployment Date:** _________________  
**Deployment Time:** _________________  
**Deployed By:** _____________________
