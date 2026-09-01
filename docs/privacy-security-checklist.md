# Privacy & Security Readiness Checklist

## Verified Supabase authorization

The live Supabase project's effective Row Level Security and Storage configuration has been reviewed manually.

### RLS status

- [x] **VERIFIED:** RLS is enabled on `profiles`.
- [x] **VERIFIED:** RLS is enabled on `properties`.
- [x] **VERIFIED:** RLS is enabled on `property_updates`.
- [x] **VERIFIED:** RLS is enabled on `property_files`.

## Database authorization

### `profiles`

- [x] **VERIFIED:** A client can read only their own profile.
- [x] **VERIFIED:** Administrators can read profiles through `is_admin(auth.uid())`.

### `properties`

- [x] **VERIFIED:** A client can read only rows where `buyer_id = auth.uid()`.
- [x] **VERIFIED:** Administrators have the intended create, read, update, and delete policies.

### `property_updates`

- [x] **VERIFIED:** A client can read only updates belonging to properties where `buyer_id = auth.uid()`.

### `property_files`

- [x] **VERIFIED:** A client can read only file metadata belonging to properties where `buyer_id = auth.uid()`.

## Authorization helper

### `public.is_admin(uuid)`

- [x] **VERIFIED:** The function uses `SECURITY DEFINER`.
- [x] **VERIFIED:** Its `search_path` is fixed to `public`.
- [x] **VERIFIED:** It checks both the user `id` and `role = 'admin'` in `public.profiles`.

## Storage authorization

### `property-files`

- [x] **VERIFIED:** The bucket has `public = false`.
- [x] **VERIFIED:** A client can read only objects linked through `property_files` to `properties` to `buyer_id = auth.uid()`.
- [x] **VERIFIED:** Administrators have the intended Storage operations.
- **Current configuration:** `allowed_mime_types` is `null`. This can be hardened in the future after a definitive list of permitted file formats is established.

## Operational safeguards

- **Best practice:** Treat signed URLs as bearer URLs: anyone who obtains one may use it until its configured lifetime expires.
- **Best practice:** Keep signed URL lifetimes no longer than operationally necessary.
- **Best practice:** Keep the Supabase service-role key server-only and out of browser bundles, logs, client-visible errors, and source control.
- **Best practice:** Only server-side code may perform service-role operations.
- **Documentation:** Retain evidence of the reviewed policies and tests performed for client and administrator accounts.

## Tracking deployment safeguards

- [ ] Before setting `NEXT_PUBLIC_GTM_ID`, configure GTM tags to require the appropriate built-in consent signals.
- [ ] Exclude `/client`, `/admin`, `/client-login`, and `/admin-login` (including their nested routes) from page-view, History Change, and other GTM triggers.
- [ ] Confirm that Custom HTML and custom-event tags cannot bypass those consent and route exclusions.
- [ ] Confirm that names, email addresses, phone numbers, cities, comments, authentication data, and other personal information are never pushed to `dataLayer`.
