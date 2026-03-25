-- Add per-visitor session tracking columns to analytics_events.
-- These fields are populated automatically by the updated analytics.js
-- on every event: a random session ID per browser tab, device type,
-- browser name, OS, and approximate city/country from IP geolocation.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS session_id  text,    -- random ID per browser session (sessionStorage)
  ADD COLUMN IF NOT EXISTS device_type text,    -- 'desktop' | 'mobile' | 'tablet'
  ADD COLUMN IF NOT EXISTS browser     text,    -- 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' | 'Other'
  ADD COLUMN IF NOT EXISTS os          text,    -- 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux' | 'Other'
  ADD COLUMN IF NOT EXISTS country     text,    -- country name from IP geolocation  (e.g. 'United States')
  ADD COLUMN IF NOT EXISTS city        text;    -- city name from IP geolocation     (e.g. 'New York')

-- Index so visitor-log queries (GROUP BY session_id) stay fast
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON analytics_events (session_id);
