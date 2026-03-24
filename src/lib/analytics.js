/**
 * GA4 analytics utility.
 * Loads gtag.js dynamically using VITE_GA4_MEASUREMENT_ID.
 * All functions are no-ops when the ID is not configured.
 */

export const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

let initialized = false;

export function initGA4() {
  if (!GA4_ID || initialized || typeof window === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path, title) {
  if (!GA4_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    send_to: GA4_ID,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!GA4_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, { ...params, send_to: GA4_ID });
}

export function trackDonateOpen(amount) {
  trackEvent('donate_button_click', { currency: 'USD', value: Number(amount) });
}

export function trackDonationCompleted(amount) {
  trackEvent('donation_completed', { currency: 'USD', value: Number(amount) });
}

export function trackRaffleEntry() {
  trackEvent('raffle_entry_submitted');
}
