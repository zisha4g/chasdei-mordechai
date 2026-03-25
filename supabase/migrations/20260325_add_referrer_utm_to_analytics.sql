-- Add referrer and UTM tracking columns to analytics_events
-- Run this in your Supabase SQL Editor

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS referrer_source  text,
  ADD COLUMN IF NOT EXISTS utm_source       text,
  ADD COLUMN IF NOT EXISTS utm_medium       text,
  ADD COLUMN IF NOT EXISTS utm_campaign     text,
  ADD COLUMN IF NOT EXISTS raw_referrer     text;
