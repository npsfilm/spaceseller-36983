# GDPR Compliance Implementation

## Overview
Comprehensive GDPR compliance features including user data export, account deletion with data cleanup, data retention policies, and consent management.

## Features Implemented

### 1. User Data Export (Right to Data Portability)
- **Location**: Settings → Datenschutz tab → "Daten exportieren" button
- **Functionality**: Exports all user data as JSON including:
  - Profile information
  - Orders and order items
  - Addresses
  - File uploads
  - Deliverables
  - Consent records
- **Edge Function**: `export-user-data`
- **Security**: Users can only export their own data (verified via auth token)

### 2. Account Deletion (Right to Erasure)
- **Location**: Settings → Datenschutz tab → "Konto dauerhaft löschen" button
- **Functionality**: 
  - Requires "DELETE" confirmation text
  - Anonymizes personal data (name, email, phone, address)
  - Deletes sensitive uploads and deliverables
  - Retains order records for legal compliance (7 years)
  - Deletes user from auth system
- **Edge Function**: `delete-account`
- **Database Function**: `anonymize_user_data()`

### 3. Consent Management
- **Location**: Settings → Datenschutz tab
- **Consent Types**:
  - **Marketing**: Marketing communications and newsletters
  - **Analytics**: Usage analytics and statistics
  - **Third Party**: External service integrations
- **Database Table**: `user_consents`
- **Features**:
  - Toggle switches for each consent type
  - Tracks granted/revoked timestamps
  - Records IP and user agent (for audit trail)
  - Users can view and update at any time

### 4. Data Retention Policies
- **Function**: `cleanup_old_orders()`
- **Policy**: Deletes completed orders older than 7 years
- **Applies to**: Orders with status `completed`, `delivered`, or `cancelled`
- **Scheduled**: Should be run via pg_cron or scheduled task

## Database Schema

### user_consents Table
```sql
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type TEXT ('marketing' | 'analytics' | 'third_party'),
  granted BOOLEAN DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Security (RLS Policies)
- Users can only view/manage their own consents
- All operations require authentication
- Uses `auth.uid()` for row-level filtering

## Edge Functions

### export-user-data
**Path**: `/functions/v1/export-user-data`
**Method**: POST
**Auth**: Required (Bearer token)
**Body**:
```json
{
  "userId": "uuid"
}
```
**Response**: JSON with complete user data
**Validation**: Zod schema ensures type safety

### delete-account
**Path**: `/functions/v1/delete-account`
**Method**: POST
**Auth**: Required (Bearer token)
**Body**:
```json
{
  "userId": "uuid",
  "confirmation": "DELETE"
}
```
**Response**: Success/error message
**Validation**: Requires exact "DELETE" confirmation

## Validation Schemas

### Location
- `src/lib/validation/gdprSchemas.ts` (Frontend)
- `supabase/functions/_shared/validation.ts` (Backend)

### Schemas
- `exportUserDataSchema`: User ID validation
- `deleteAccountSchema`: User ID + "DELETE" confirmation
- `updateConsentSchema`: Consent type and boolean validation

## Security Features

1. **Authentication Required**: All operations require valid auth token
2. **User Verification**: Users can only access their own data
3. **Confirmation Required**: Account deletion requires "DELETE" text
4. **Soft Delete**: Personal data anonymized, order records retained
5. **Audit Trail**: Consent changes tracked with timestamps and IP
6. **RLS Policies**: Database-level security on all tables

## Legal Compliance

### GDPR Articles Covered
- **Article 15**: Right of access (data export)
- **Article 16**: Right to rectification (profile updates)
- **Article 17**: Right to erasure (account deletion)
- **Article 20**: Right to data portability (JSON export)
- **Article 7**: Consent management (consent records)

### Data Retention
- Personal data: Anonymized on deletion
- Order records: Retained 7 years (German tax law)
- Consent records: Retained as proof of consent

## User Interface

### Settings Page Updates
- New "Datenschutz" tab added alongside "Profil" and "Sicherheit"
- Shield icon for privacy tab
- Three-section layout:
  1. **Consent Management**: Toggle switches for each consent type
  2. **Data Export**: Download button with GDPR reference
  3. **Danger Zone**: Account deletion with warning styling

### UX Features
- Clear descriptions for each consent type
- Confirmation dialog for account deletion
- Loading states during operations
- Toast notifications for success/error feedback
- Mobile-responsive design

## Testing Checklist

- [ ] Export user data and verify JSON structure
- [ ] Toggle consent switches and verify database updates
- [ ] Attempt account deletion without confirmation (should fail)
- [ ] Complete account deletion with "DELETE" confirmation
- [ ] Verify personal data anonymized after deletion
- [ ] Verify order records retained after deletion
- [ ] Test unauthorized access (different user ID)
- [ ] Test data export download functionality
- [ ] Verify consent timestamps recorded correctly
- [ ] Test mobile responsive layout

## Future Enhancements

1. **Automated Cleanup**: Schedule `cleanup_old_orders()` via pg_cron
2. **Email Notifications**: Send confirmation emails for:
   - Data export requests
   - Account deletion
   - Consent changes
3. **Audit Log**: Comprehensive logging of GDPR operations
4. **Multi-language**: Translate privacy notices
5. **Cookie Banner**: Frontend cookie consent integration

## Notes

⚠️ **Pre-existing Linter Warning**: The security linter shows a warning about "Leaked Password Protection Disabled" in Supabase Auth settings. This is a **pre-existing issue** unrelated to this GDPR implementation and should be addressed separately in the Supabase Auth configuration.

## Files Created/Modified

### New Files
- `src/components/settings/GDPRSection.tsx`
- `src/lib/validation/gdprSchemas.ts`
- `supabase/functions/export-user-data/index.ts`
- `supabase/functions/delete-account/index.ts`
- `supabase/functions/_shared/validation.ts`

### Modified Files
- `src/pages/Settings.tsx` (added Datenschutz tab)

### Database Migrations
- Created `user_consents` table with RLS
- Added `cleanup_old_orders()` function
- Added `anonymize_user_data()` function
