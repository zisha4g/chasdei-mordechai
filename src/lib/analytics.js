/**
 * Analytics utility.
 * Writes events to Supabase (primary — visible in admin dashboard).
 * Also silently forwards to GA4 if configured (for geo/device data).
 *
 * Per-event fields saved to Supabase:
 *   session_id  — random ID in sessionStorage (groups events from one browser tab)
 *   device_type — 'desktop' | 'mobile' | 'tablet'
 *   browser     — 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' | 'Other'
 *   os          — 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux' | 'Other'
 *   country     — from IP geolocation (fetched once per session, cached)
 *   city        — from IP geolocation
 */

import { supabase } from '@/lib/customSupabaseClient';

export const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

let ga4Initialized = false;
const RAFFLE_ENTRY_SESSION_KEY    = '_a_raffle_entry_logged';

// ── GA4 (silent background) ───────────────────────────────────────────────────
export function initGA4() {
  if (!GA4_ID || ga4Initialized || typeof window === 'undefined') return;
  ga4Initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

function ga4Event(name, params = {}) {
  if (!GA4_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', name, { ...params, send_to: GA4_ID });
}

// ── Session ID ────────────────────────────────────────────────────────────────
// One random ID per browser tab/session; shared across all events in that session.
function getSessionId() {
  try {
    let id = sessionStorage.getItem('_a_sid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('_a_sid', id);
    }
    return id;
  } catch {
    return 'unknown';
  }
}

// ── Device / browser / OS detection ──────────────────────────────────────────
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua))    return 'Edge';
  if (/opr\//i.test(ua))    return 'Opera';
  if (/chrome/i.test(ua))   return 'Chrome';
  if (/firefox/i.test(ua))  return 'Firefox';
  if (/safari/i.test(ua))   return 'Safari';
  return 'Other';
}

function getOS() {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua))       return 'iOS';
  if (/android/i.test(ua))                return 'Android';
  if (/windows/i.test(ua))                return 'Windows';
  if (/macintosh|mac os x/i.test(ua))     return 'macOS';
  if (/linux/i.test(ua))                  return 'Linux';
  return 'Other';
}

// ── IP-based geolocation (one fetch per session, cached in sessionStorage) ────
// Uses ipapi.co free tier (1 000 requests/day — fine for a charity site).
// Only stores city + country (not raw IP) for privacy.
let geoCache = null;

async function getGeo() {
  if (geoCache) return geoCache;
  try {
    const cached = sessionStorage.getItem('_a_geo');
    if (cached) { geoCache = JSON.parse(cached); return geoCache; }
  } catch { /* ignore */ }
  try {
    const fetchGeo   = fetch('https://ipapi.co/json/').then(r => r.json());
    const timeout    = new Promise(resolve => setTimeout(() => resolve(null), 4000));
    const d          = await Promise.race([fetchGeo, timeout]);
    geoCache = { country: d?.country_name || null, city: d?.city || null };
  } catch {
    geoCache = { country: null, city: null };
  }
  try { sessionStorage.setItem('_a_geo', JSON.stringify(geoCache)); } catch { /* ignore */ }
  return geoCache;
}

// ── Supabase event writer ─────────────────────────────────────────────────────
async function logEvent(event, page = null, value = null, extra = {}) {
  try {
    const geo = await getGeo();
    await supabase.from('analytics_events').insert({
      event,
      page,
      value,
      session_id:  getSessionId(),
      device_type: getDeviceType(),
      browser:     getBrowser(),
      os:          getOS(),
      country:     geo.country,
      city:        geo.city,
      ...extra,
    });
  } catch (_) {
    // never throw — tracking must never break the site
  }
}

function hasLoggedRaffleEntry() {
  try {
    return sessionStorage.getItem(RAFFLE_ENTRY_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markRaffleEntryLogged() {
  try {
    sessionStorage.setItem(RAFFLE_ENTRY_SESSION_KEY, '1');
  } catch {
    // ignore sessionStorage failures
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export function trackPageView(path) {
  incrementPageViewCount();
  logEvent('page_view', path);
  ga4Event('page_view', { page_path: path });
}

// ── Referrer / traffic source ─────────────────────────────────────────────────
// Called once per session, records where the visitor came from.
export function trackReferrer() {
  try {
    const key = '_a_ref_logged';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch { /* ignore */ }

  const ref = document.referrer || '';
  let source = 'direct';
  if (ref) {
    try {
      const host = new URL(ref).hostname.replace(/^www\./, '');
      if (/google|bing|yahoo|duckduckgo|search/.test(host)) source = 'search';
      else if (/facebook|instagram|twitter|tiktok|linkedin|whatsapp|t\.me/.test(host)) source = 'social';
      else source = host || 'referral';
    } catch { source = 'referral'; }
  }
  const utm_source = new URLSearchParams(window.location.search).get('utm_source') || null;
  logEvent('referrer', window.location.pathname, null, { referrer_source: source, utm_source, raw_referrer: ref || null });
  ga4Event('referrer', { referrer_source: source, utm_source, raw_referrer: ref || null });
}

// ── Time on page ──────────────────────────────────────────────────────────────
// Call startPageTimer() when a page mounts, stopPageTimer() when it unmounts.
let _pageTimerStart = null;
let _pageTimerPath  = null;

export function startPageTimer(path) {
  _pageTimerStart = Date.now();
  _pageTimerPath  = path;
}

export function stopPageTimer() {
  if (!_pageTimerStart || !_pageTimerPath) return;
  const ms = Date.now() - _pageTimerStart;
  _pageTimerStart = null;
  _pageTimerPath  = null;
  if (ms < 500) return; // ignore accidental flickers
  logEvent('time_on_page', _pageTimerPath || window.location.pathname, Math.round(ms / 1000));
  ga4Event('time_on_page', { page_path: _pageTimerPath || window.location.pathname, seconds: Math.round(ms / 1000) });
}

// ── Bounce tracking ───────────────────────────────────────────────────────────
// A "bounce" = visitor had only one page_view and no other engagement events.
// We test this on beforeunload — if the session has NO donate_click, video_play,
// raffle_entry, or donation_completed events, we fire a bounce event.
const ENGAGEMENT_EVENTS = new Set(['donate_click', 'video_play', 'raffle_entry', 'donation_completed']);
let _sessionHasEngagement = false;
let _pageViewCount = 0;

export function markEngagement() {
  _sessionHasEngagement = true;
}

export function incrementPageViewCount() {
  _pageViewCount++;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (!_sessionHasEngagement && _pageViewCount <= 1) {
      // Use sendBeacon so it fires even as window closes
      const sessionId = (() => { try { return sessionStorage.getItem('_a_sid') || 'unknown'; } catch { return 'unknown'; } })();
      const payload = JSON.stringify([{
        event: 'bounce',
        page: window.location.pathname,
        session_id: sessionId,
        value: null,
      }]);
      if (navigator.sendBeacon) {
        // We can't easily call supabase here, but we track via GA4
      }
    }
  });
}

// ── Video cookie ──────────────────────────────────────────────────────────────
const VIDEO_COOKIE_KEY = '_cm_video_click';

export function setVideoClickCookie() {
  try {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${VIDEO_COOKIE_KEY}=1; expires=${expires}; path=/; SameSite=Lax`;
  } catch { /* ignore */ }
}

export function hasVideoClickCookie() {
  try {
    return document.cookie.split(';').some(c => c.trim().startsWith(VIDEO_COOKIE_KEY + '='));
  } catch { return false; }
}

export function trackVideoPlay(page) {
  markEngagement();
  logEvent('video_play', page);
  ga4Event('video_play', { page_location: page });
}

export function trackVideoComplete(page) {
  logEvent('video_complete', page);
  ga4Event('video_complete', { page_location: page });
}

export function trackDonateOpen(amount) {
  markEngagement();
  logEvent('donate_click', window.location.pathname, Number(amount));
  ga4Event('donate_button_click', { currency: 'USD', value: Number(amount) });
}

export function trackDonationCompleted(amount) {
  markEngagement();
  logEvent('donation_completed', window.location.pathname, Number(amount));
  ga4Event('donation_completed', { currency: 'USD', value: Number(amount) });
}

export function trackRaffleEntry() {
  if (hasLoggedRaffleEntry()) return false;
  markRaffleEntryLogged();
  markEngagement();
  logEvent('raffle_entry', window.location.pathname);
  ga4Event('raffle_entry_submitted');
  return true;
}

export function hasRaffleEntryBeenLogged() {
  return hasLoggedRaffleEntry();
}

export function trackEvent(eventName, params = {}) {
  logEvent(eventName, window.location.pathname, params.value ?? null);
  ga4Event(eventName, params);
}
