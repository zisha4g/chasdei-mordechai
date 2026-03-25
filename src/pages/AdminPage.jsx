import React, { useState, useEffect, useCallback } from 'react';
import { Settings, X, BarChart2, Calendar, ChevronDown, ChevronRight, Monitor, Smartphone } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { DEFAULT_SITE_SETTINGS, fetchLatestSiteSettings } from '@/hooks/useSiteSettings';
import { GA4_ID } from '@/lib/analytics';

// ── helpers ──────────────────────────────────────────────────────────────────
function downloadCSV(rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `raffle_entries_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const EMPTY_FORM = { first_name: '', last_name: '', email: '', phone: '', address: '', amount: '' };

const COLUMN_WIDTHS = {
  first_name: 'w-[11%]',
  last_name: 'w-[11%]',
  email: 'w-[21%]',
  phone: 'w-[12%]',
  address: 'w-[21%]',
  amount: 'w-[10%]',
  created_at: 'w-[14%]',
};

const EMPTY_SETTINGS_FORM = {
  video_url: DEFAULT_SITE_SETTINGS.videoUrl,
  donorfuse_campaign_id: String(DEFAULT_SITE_SETTINGS.donorFuseCampaignId),
  donorfuse_link: DEFAULT_SITE_SETTINGS.donorFuseLink,
  looker_studio_url: '',
};

function SiteSettingsModal({ isOpen, onClose }) {
  const [settingsId, setSettingsId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_SETTINGS_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { data, error: err } = await fetchLatestSiteSettings();

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    const row = data;
    if (!row) {
      setSettingsId(null);
      setForm({ ...EMPTY_SETTINGS_FORM });
      return;
    }

    setSettingsId(row.id ?? null);
    setForm({
      video_url: row.video_url || EMPTY_SETTINGS_FORM.video_url,
      donorfuse_campaign_id: String(row.donorfuse_campaign_id ?? EMPTY_SETTINGS_FORM.donorfuse_campaign_id),
      donorfuse_link: row.donorfuse_link || EMPTY_SETTINGS_FORM.donorfuse_link,
      looker_studio_url: row.looker_studio_url || '',
    });
  }, []);

  useEffect(() => {
    if (isOpen) loadSettings();
  }, [isOpen, loadSettings]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const campaignId = Number(String(form.donorfuse_campaign_id).trim());
    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      setSaving(false);
      setError('Campaign ID must be a positive number.');
      return;
    }

    const payload = {
      video_url: form.video_url.trim(),
      donorfuse_campaign_id: campaignId,
      donorfuse_link: form.donorfuse_link.trim(),
      looker_studio_url: form.looker_studio_url.trim(),
    };

    let err;

    if (settingsId) {
      ({ error: err } = await supabase.from('site_settings').update(payload).eq('id', settingsId));
    } else {
      const { data, error: insertErr } = await supabase
        .from('site_settings')
        .insert(payload)
        .select('id')
        .single();
      err = insertErr;
      if (!insertErr) setSettingsId(data?.id ?? null);
    }

    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess('Settings saved. The public site will use the new values on reload.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Site Settings</h2>
            <p className="text-xs text-gray-400">Update the video link and DonorFuse settings without changing code.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={loadSettings}
              type="button"
              className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs px-3 py-1.5 rounded-lg transition"
            >
              Refresh Settings
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-gray-400">Loading settings…</div>
          ) : (
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Video URL or Vimeo ID</label>
                <input
                  value={form.video_url}
                  onChange={updateField('video_url')}
                  placeholder="https://vimeo.com/1173352905"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DonorFuse Campaign ID</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.donorfuse_campaign_id}
                  onChange={updateField('donorfuse_campaign_id')}
                  placeholder="11426"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DonorFuse Link Slug</label>
                <input
                  value={form.donorfuse_link}
                  onChange={updateField('donorfuse_link')}
                  placeholder="cm"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Looker Studio Embed URL</label>
                <input
                  value={form.looker_studio_url}
                  onChange={updateField('looker_studio_url')}
                  placeholder="https://lookerstudio.google.com/embed/reporting/..."
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <p className="mt-1 text-xs text-gray-400">Paste the embed URL from a Looker Studio report to show GA4 data in the Analytics panel.</p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm px-4 py-2 rounded-lg transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Analytics panel helpers (module-level, no React) ─────────────────────────
function toDateStr(d) { return d.toISOString().slice(0, 10); }
function daysAgoStr(n) { const d = new Date(); d.setDate(d.getDate() - n); return toDateStr(d); }

function fmtDuration(ms) {
  if (ms <= 0)       return '< 1s';
  if (ms < 60000)    return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000)  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

function fmtRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000)    return 'just now';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}

const DATE_PRESETS = [
  { label: 'Today',   days: 0  },
  { label: '7 days',  days: 7  },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

const EV_ICON  = { page_view: '📄', video_play: '▶️', video_complete: '🏁', donate_click: '💛', donation_completed: '✅', raffle_entry: '🎟️' };
const EV_LABEL = { page_view: 'Page visit', video_play: 'Watched video', video_complete: 'Video ended', donate_click: 'Clicked donate', donation_completed: 'Completed donation', raffle_entry: 'Entered raffle' };

function DeviceIcon({ type }) {
  if (type === 'mobile') return <Smartphone size={13} className="text-gray-400 shrink-0" />;
  return <Monitor size={13} className="text-gray-400 shrink-0" />;
}

// ── Analytics full-page panel ──────────────────────────────────────────────────
function AnalyticsPanel({ isOpen, onClose }) {
  const [events,           setEvents]           = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [tableError,       setTableError]       = useState(false);
  const [dateFrom,         setDateFrom]         = useState(() => daysAgoStr(30));
  const [dateTo,           setDateTo]           = useState(() => toDateStr(new Date()));
  const [activePreset,     setActivePreset]     = useState(30);
  const [expandedSession,  setExpandedSession]  = useState(null);

  const applyPreset = (days) => {
    setActivePreset(days);
    const today = toDateStr(new Date());
    setDateFrom(days === 0 ? today : daysAgoStr(days));
    setDateTo(today);
  };

  const load = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setTableError(false);
    const { data, error: err } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', dateFrom + 'T00:00:00.000Z')
      .lte('created_at', dateTo   + 'T23:59:59.999Z')
      .order('created_at', { ascending: true });
    setLoading(false);
    if (err) {
      if (err.code === '42P01' || String(err.message).includes('does not exist')) setTableError(true);
      return;
    }
    setEvents(data || []);
  }, [isOpen, dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  if (!isOpen) return null;

  // ── Derived stats ──────────────────────────────────────────────────────────
  const byEvent       = (name) => events.filter(e => e.event === name);
  const pageViews     = byEvent('page_view');
  const videoPlays    = byEvent('video_play');
  const donateClicks  = byEvent('donate_click');
  const donations     = byEvent('donation_completed');
  const raffleEntries = byEvent('raffle_entry');
  const totalRaised   = donations.reduce((s, e) => s + (Number(e.value) || 0), 0);

  // ── Bar chart: up to 14 evenly-distributed buckets across the date range ──
  const allDates = (() => {
    const dates = [];
    const cur = new Date(dateFrom + 'T12:00:00');
    const end = new Date(dateTo   + 'T12:00:00');
    while (cur <= end && dates.length < 200) { dates.push(toDateStr(cur)); cur.setDate(cur.getDate() + 1); }
    return dates;
  })();
  const CHART_N    = Math.min(allDates.length, 14);
  const chunkSize  = Math.ceil(allDates.length / CHART_N);
  const chartBars  = Array.from({ length: CHART_N }, (_, i) => {
    const bucket = new Set(allDates.slice(i * chunkSize, (i + 1) * chunkSize));
    const label  = new Date(allDates[i * chunkSize] + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count  = events.filter(e => bucket.has(e.created_at?.slice(0, 10))).length;
    return { key: allDates[i * chunkSize], label, count };
  });
  const barMax = Math.max(1, ...chartBars.map(b => b.count));

  // ── Top pages ──
  const pageCounts = {};
  pageViews.forEach(e => { const p = e.page || '/'; pageCounts[p] = (pageCounts[p] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
  const pageMax  = topPages[0]?.[1] || 1;

  // ── Session grouping (visitor logs) ──
  const sessionMap = {};
  events.forEach(e => {
    if (!e.session_id) return;
    if (!sessionMap[e.session_id]) {
      sessionMap[e.session_id] = {
        session_id:  e.session_id,
        device_type: e.device_type || 'desktop',
        browser:     e.browser || 'Unknown',
        os:          e.os || null,
        country:     e.country || null,
        city:        e.city    || null,
        events:      [],
      };
    }
    sessionMap[e.session_id].events.push(e);
  });
  const sessions = Object.values(sessionMap)
    .sort((a, b) => new Date(b.events[0].created_at) - new Date(a.events[0].created_at))
    .slice(0, 100);

  const uniqueVisitors = sessions.length;
  const uniqueSessionsForEvent = (name) => sessions.filter(s => s.events.some(e => e.event === name)).length;
  const uniqueVideoViewers = uniqueSessionsForEvent('video_play');
  const uniqueDonateClickers = uniqueSessionsForEvent('donate_click');
  const uniqueDonors = uniqueSessionsForEvent('donation_completed');
  const uniqueRaffleEntrants = uniqueSessionsForEvent('raffle_entry');

  const funnelMax   = uniqueVisitors || 1;
  const funnelSteps = [
    { label: 'Visited Site',   count: uniqueVisitors,      color: 'bg-indigo-500',  prev: null                   },
    { label: 'Watched Video',  count: uniqueVideoViewers,  color: 'bg-sky-500',     prev: uniqueVisitors         },
    { label: 'Clicked Donate', count: uniqueDonateClickers,color: 'bg-violet-500',  prev: uniqueVideoViewers     },
    { label: 'Donated',        count: uniqueDonors,        color: 'bg-emerald-500', prev: uniqueDonateClickers   },
    { label: 'Entered Raffle', count: uniqueRaffleEntrants,color: 'bg-amber-500',   prev: uniqueDonors           },
  ];

  const statCards = [
    { label: 'Site Visitors', value: uniqueVisitors,               sub: `${pageViews.length} page views`,                           bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  num: 'text-indigo-900'  },
    { label: 'Video Plays',   value: uniqueVideoViewers,           sub: `${videoPlays.length} plays total`,                         bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', num: 'text-sky-900' },
    { label: 'Donations',     value: uniqueDonors,                 sub: `$${totalRaised.toLocaleString()} raised`,                   bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', num: 'text-emerald-900' },
    { label: 'Raffle Entries',value: uniqueRaffleEntrants,         sub: `${donateClicks.length} clicks total`,                       bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   num: 'text-amber-900'   },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#f8f9ff' }}>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Website Activity</h1>
              <p className="text-xs text-gray-400">Live data from your database</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">↻ Refresh</button>
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
              <X size={15} /> Close
            </button>
          </div>
        </div>

        {/* ── Date range bar ── */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex flex-wrap items-center gap-2">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            {DATE_PRESETS.map(({ label, days }) => (
              <button
                key={label}
                onClick={() => applyPreset(days)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                  activePreset === days
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-gray-600 border-gray-200 bg-white hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="text-gray-300 text-xs mx-1">|</span>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                max={dateTo}
                onChange={e => { setDateFrom(e.target.value); setActivePreset(null); }}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="date"
                value={dateTo}
                min={dateFrom}
                max={toDateStr(new Date())}
                onChange={e => { setDateTo(e.target.value); setActivePreset(null); }}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">Loading analytics…</div>
      )}

      {!loading && tableError && (
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Analytics table not set up yet</h2>
          <p className="text-sm text-gray-500 mb-3">Run both migrations in your Supabase SQL Editor:</p>
          <p className="text-xs font-mono bg-gray-100 rounded px-3 py-1.5 inline-block mb-1">supabase/migrations/20260324_create_analytics_events.sql</p><br />
          <p className="text-xs font-mono bg-gray-100 rounded px-3 py-1.5 inline-block">supabase/migrations/20260325_add_session_to_analytics.sql</p>
        </div>
      )}

      {!loading && !tableError && (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

          {/* ── Live badge ── */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live data
            </span>
            <span className="text-xs text-gray-400">{events.length.toLocaleString()} events · {sessions.length} sessions in this range</span>
          </div>

          {/* ── Stat cards ── */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statCards.map(({ label, value, sub, bg, border, text, num }) => (
                <div key={label} className={`rounded-2xl border ${bg} ${border} px-5 py-5`}>
                  <p className={`text-3xl font-extrabold ${num}`}>{value}</p>
                  <p className={`text-sm font-semibold mt-1 ${text}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Conversion funnel ── */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-800 mb-1">Conversion Funnel</h2>
              <p className="text-xs text-gray-400 mb-5">How visitors moved through your site</p>
              <div className="space-y-3">
                {funnelSteps.map(({ label, count, color, prev }) => {
                  const widthPct = funnelMax > 0 ? Math.max(Math.round((count / funnelMax) * 100), count > 0 ? 2 : 0) : 0;
                  const dropOff  = prev != null && prev > 0 ? Math.round((1 - count / prev) * 100) : null;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-32 text-xs font-semibold text-gray-600 text-right shrink-0">{label}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div className={`h-full ${color} rounded-lg flex items-center pl-3 transition-all`} style={{ width: `${widthPct}%` }}>
                          {widthPct > 8 && <span className="text-xs font-bold text-white">{count.toLocaleString()}</span>}
                        </div>
                      </div>
                      <span className="w-14 text-xs font-bold text-gray-700 text-right shrink-0">{count.toLocaleString()}</span>
                      <span className="w-14 text-xs text-right shrink-0">{dropOff !== null ? <span className="text-red-400">-{dropOff}%</span> : null}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Daily activity bar chart ── */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Daily Activity</h2>
                  <p className="text-xs text-gray-400">All events in selected range</p>
                </div>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Live</span>
              </div>
              <div className="flex items-end gap-1.5 h-36">
                {chartBars.map(({ key, label, count }) => (
                  <div key={key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    {count > 0 && <span className="text-xs font-bold text-indigo-700">{count}</span>}
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${Math.max(count === 0 ? 3 : 6, Math.round((count / barMax) * 112))}px`,
                        background: count === 0 ? '#e0e7ff' : 'linear-gradient(to top, #4f46e5, #818cf8)',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                {chartBars.map(({ key, label }, i) => (
                  <div key={key} className="flex-1 text-center">
                    <span className="text-[9px] text-gray-400">{i % 2 === 0 ? label : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Top pages ── */}
          {topPages.length > 0 && (
            <section>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-1">Top Pages</h2>
                <p className="text-xs text-gray-400 mb-5">Most visited pages in selected range</p>
                <div className="space-y-2.5">
                  {topPages.map(([path, count]) => (
                    <div key={path} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-600 w-36 truncate shrink-0">{path}</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded">
                        <div className="h-full bg-sky-400 rounded" style={{ width: `${Math.round((count / pageMax) * 100)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Visitor logs ── */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Visitor Logs</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Every visitor's device, location, and step-by-step journey — click a row to expand</p>
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full shrink-0">{sessions.length} sessions</span>
              </div>

              {sessions.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  {events.length === 0
                    ? 'No visitor data in this date range.'
                    : 'Session tracking not yet active — run the migration to see detailed visitor logs.'}
                </div>
              ) : (
                <>
                  {/* header row */}
                  <div className="hidden sm:flex items-center gap-3 px-6 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    <span className="w-24 shrink-0">Time</span>
                    <span className="w-36 shrink-0">Device</span>
                    <span className="w-36 shrink-0">Location</span>
                    <span className="flex-1">Journey</span>
                    <span className="w-28 text-right shrink-0">Events · Duration</span>
                    <span className="w-4 shrink-0" />
                  </div>

                  <div className="divide-y divide-gray-100">
                    {sessions.map((s) => {
                      const first     = s.events[0];
                      const last      = s.events[s.events.length - 1];
                      const duration  = new Date(last.created_at) - new Date(first.created_at);
                      const isOpen    = expandedSession === s.session_id;
                      const pages     = [...new Map(s.events.filter(e => e.event === 'page_view').map(e => [e.page, e])).keys()];

                      return (
                        <div key={s.session_id}>
                          <button
                            onClick={() => setExpandedSession(isOpen ? null : s.session_id)}
                            className="w-full text-left px-6 py-3.5 hover:bg-indigo-50/40 transition flex items-center gap-3"
                          >
                            {/* Time */}
                            <span className="w-24 text-xs text-gray-500 shrink-0">{fmtRelative(first.created_at)}</span>

                            {/* Device + browser + OS */}
                            <span className="w-36 flex items-center gap-1.5 shrink-0 min-w-0">
                              <DeviceIcon type={s.device_type} />
                              <span className="text-xs text-gray-600 truncate">
                                {s.browser}{s.os ? ` / ${s.os}` : ''}
                              </span>
                            </span>

                            {/* Location */}
                            <span className="w-36 text-xs text-gray-500 truncate shrink-0">
                              {s.city && s.country ? `${s.city}, ${s.country}` : s.country || <span className="text-gray-300">—</span>}
                            </span>

                            {/* Journey summary (pages visited in order) */}
                            <span className="flex-1 text-xs text-gray-400 truncate hidden sm:block">
                              {pages.length > 0 ? pages.join(' → ') : (first.page || '—')}
                            </span>

                            {/* Count + duration */}
                            <span className="w-28 text-xs text-gray-400 text-right shrink-0">
                              {s.events.length} events · {fmtDuration(duration)}
                            </span>

                            {/* Expand chevron */}
                            <span className="w-4 text-gray-300 shrink-0">
                              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          </button>

                          {/* ── Expanded event timeline ── */}
                          {isOpen && (
                            <div className="px-6 pb-5 pt-3 bg-indigo-50/30 border-t border-indigo-100">
                              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
                                {s.events.map((ev, i) => (
                                  <div key={i} className="flex items-start gap-3 text-xs">
                                    <span className="text-gray-400 font-mono w-20 shrink-0 pt-px">
                                      {new Date(ev.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className="w-4 shrink-0">{EV_ICON[ev.event] || '•'}</span>
                                    <span className="font-semibold text-gray-700">{EV_LABEL[ev.event] || ev.event}</span>
                                    {ev.page && <span className="text-indigo-400 font-mono">{ev.page}</span>}
                                    {ev.value != null && <span className="text-emerald-600 font-bold ml-auto shrink-0">${Number(ev.value).toLocaleString()}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </section>

          {events.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-sm">No events in this date range yet.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) { setError(err.message); }
    // on success the page root's onAuthStateChange fires and renders AdminPanel automatically
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Admin Login</h1>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="admin@example.com"
            required
            autoComplete="email"
            className="mt-1 w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="mt-1 w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition">
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function EntryModal({ entry, onClose, onSaved }) {
  const isEdit = Boolean(entry?.id);
  const [form, setForm] = useState(
    isEdit
      ? { first_name: entry.first_name || '', last_name: entry.last_name || '', email: entry.email || '', phone: entry.phone || '', address: entry.address || '', amount: entry.amount ?? '' }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      first_name: form.first_name.trim() || null,
      last_name:  form.last_name.trim()  || null,
      email:      form.email.trim()      || null,
      phone:      form.phone.trim()      || null,
      address:    form.address.trim()    || null,
      amount:     form.amount !== '' ? Number(form.amount) : null,
    };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase.from('raffle_entries').update(payload).eq('id', entry.id));
    } else {
      ({ error: err } = await supabase.from('raffle_entries').insert(payload));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  const fields = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name',  label: 'Last Name' },
    { key: 'email',      label: 'Email', type: 'email' },
    { key: 'phone',      label: 'Phone' },
    { key: 'address',    label: 'Address' },
    { key: 'amount',     label: 'Donation Amount ($)', type: 'number' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold mb-5 text-gray-800">{isEdit ? 'Edit Entry' : 'Add New Entry'}</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {fields.map(({ key, label, type = 'text' }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={handle(key)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-50">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main admin panel ──────────────────────────────────────────────────────────
function AdminPanel({ onLogout }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', entry } | { mode: 'confirm-delete', id }
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('raffle_entries')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setEntries(data || []);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const confirmDelete = (id) => setModal({ mode: 'confirm-delete', id });

  const handleDelete = async (id) => {
    setModal(null);
    setDeleting(id);
    const { error: err } = await supabase.from('raffle_entries').delete().eq('id', id);
    setDeleting(null);
    if (err) { setError('Error deleting: ' + err.message); return; }
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(e.first_name || '').toLowerCase().includes(q) ||
      String(e.last_name  || '').toLowerCase().includes(q) ||
      String(e.email      || '').toLowerCase().includes(q) ||
      String(e.phone      || '').toLowerCase().includes(q) ||
      String(e.address    || '').toLowerCase().includes(q)
    );
  });

  const DISPLAY_COLS = ['first_name', 'last_name', 'email', 'phone', 'address', 'amount', 'created_at'];
  const LABELS = {
    first_name: 'First Name', last_name: 'Last Name', email: 'Email',
    phone: 'Phone', address: 'Address', amount: 'Amount ($)', created_at: 'Date',
  };

  const fmt = (col, val) => {
    if (val === null || val === undefined) return <span className="text-gray-300">—</span>;
    if (col === 'created_at') return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (col === 'amount') return `$${Number(val).toLocaleString()}`;
    return val;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Chasdei Mordechai — Admin</h1>
          <p className="text-xs text-gray-400">Raffle Entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition"
            title="Analytics"
            aria-label="Open analytics"
          >
            <BarChart2 size={18} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition"
            title="Site Settings"
            aria-label="Open site settings"
          >
            <Settings size={18} />
          </button>
          <button onClick={onLogout} className="text-xs text-gray-400 hover:text-gray-700 transition">Logout</button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, address…"
            className="border rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add Entry
          </button>
          <button
            onClick={() => downloadCSV(filtered)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            ⬇ Download Excel / CSV
          </button>
          <button
            onClick={fetchEntries}
            className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm px-4 py-2 rounded-lg transition"
          >
            ↻ Refresh
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-3">
          {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}${search ? ' (filtered)' : ''}`}
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto xl:overflow-x-visible">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Loading entries…</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              {search ? 'No entries match your search.' : 'No raffle entries yet.'}
            </div>
          ) : (
            <table className="w-full table-fixed text-sm min-w-[1100px] xl:min-w-0">
              <thead>
                <tr className="border-b bg-gray-50">
                  {DISPLAY_COLS.map((col) => (
                    <th key={col} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${COLUMN_WIDTHS[col] || ''} ${col === 'amount' || col === 'created_at' ? 'whitespace-nowrap' : 'whitespace-normal'}`}>
                      {LABELS[col] || col}
                    </th>
                  ))}
                  <th className="w-[120px] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr key={entry.id} className={`border-b last:border-0 hover:bg-amber-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    {DISPLAY_COLS.map((col) => (
                      <td key={col} className={`px-4 py-3 align-top text-gray-700 ${col === 'amount' || col === 'created_at' ? 'whitespace-nowrap' : 'whitespace-normal break-words'}`}>
                        {fmt(col, entry[col])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setModal({ mode: 'edit', entry })}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(entry.id)}
                          disabled={deleting === entry.id}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1 rounded-lg transition disabled:opacity-40"
                        >
                          {deleting === entry.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Entry add/edit modal */}
      {modal && modal.mode !== 'confirm-delete' && (
        <EntryModal
          entry={modal.mode === 'edit' ? modal.entry : null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchEntries(); }}
        />
      )}

      {/* Custom delete confirmation */}
      {modal?.mode === 'confirm-delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-gray-800">Delete Entry?</h2>
            <p className="text-sm text-gray-500">This entry will be permanently removed. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(modal.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AnalyticsPanel isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
    </div>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => { await supabase.auth.signOut(); };

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  return session ? <AdminPanel onLogout={logout} /> : <LoginScreen />;
}
