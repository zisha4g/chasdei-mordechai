-- Add Looker Studio embed URL to site_settings
-- This allows the admin to configure a GA4 dashboard report visible in the Analytics panel.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS looker_studio_url text NOT NULL DEFAULT '';
