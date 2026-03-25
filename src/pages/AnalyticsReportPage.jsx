import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Calendar, ChevronDown, ChevronRight, Monitor, Smartphone, Tablet, ArrowLeft, Globe, Share2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

// ── helpers ───────────────────────────────────────────────────────────────────
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
  if (type === 'mobile')  return <Smartphone size={13} className="text-gray-400 shrink-0" />;
  if (type === 'tablet')  return <Tablet      size={13} className="text-gray-400 shrink-0" />;
  return <Monitor size={13} className="text-gray-400 shrink-0" />;
}

const SOURCE_META = {
  direct:   { label: 'Direct',        color: 'bg-slate-500',   light: 'bg-slate-100',   text: 'text-slate-700'   },
  search:   { label: 'Search',         color: 'bg-sky-500',     light: 'bg-sky-100',     text: 'text-sky-700'     },
  social:   { label: 'Social Media',   color: 'bg-violet-500',  light: 'bg-violet-100',  text: 'text-violet-700'  },
  referral: { label: 'Referral',       color: 'bg-amber-500',   light: 'bg-amber-100',   text: 'text-amber-700'   },
  campaign: { label: 'Campaign',       color: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700' },
};
function sourceMeta(key) {
  if (!key || key === 'direct') return SOURCE_META.direct;
  if (SOURCE_META[key])         return SOURCE_META[key];
  return { label: key, color: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-700' };
}

// ── Analytics page content ────────────────────────────────────────────────────
function AnalyticsContent({ onBack }) {
  const [events,           setEvents]           = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [tableError,       setTableError]       = useState(false);
  const [dateFrom,         setDateFrom]         = useState(() => daysAgoStr(30));
  const [dateTo,           setDateTo]           = useState(() => toDateStr(new Date()));
  const [activePreset,     setActivePreset]     = useState(30);
  const [expandedSession,  setExpandedSession]  = useState(null);
  const [activeVisitors,   setActiveVisitors]   = useState(null);
  const [hoveredDevice,    setHoveredDevice]    = useState(null);

  // Poll active visitors (distinct session_ids with an event in the last 5 min) every 30s
  useEffect(() => {
    const fetchActive = async () => {
      const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('analytics_events')
        .select('session_id')
        .gte('created_at', since);
      if (data) {
        const unique = new Set(data.map(r => r.session_id).filter(Boolean));
        setActiveVisitors(unique.size);
      }
    };
    fetchActive();
    const interval = setInterval(fetchActive, 30000);
    return () => clearInterval(interval);
  }, []);

  const applyPreset = (days) => {
    setActivePreset(days);
    const today = toDateStr(new Date());
    setDateFrom(days === 0 ? today : daysAgoStr(days));
    setDateTo(today);
  };

  const load = useCallback(async () => {
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
  }, [dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const byEvent       = (name) => events.filter(e => e.event === name);
  const pageViews     = byEvent('page_view');
  const videoPlays    = byEvent('video_play');
  const donateClicks  = byEvent('donate_click');
  const donations     = byEvent('donation_completed');
  const raffleEntries = byEvent('raffle_entry');
  const totalRaised   = donations.reduce((s, e) => s + (Number(e.value) || 0), 0);

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

  const pageCounts = {};
  pageViews.forEach(e => { const p = e.page || '/'; pageCounts[p] = (pageCounts[p] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
  const pageMax  = topPages[0]?.[1] || 1;

  // ── Traffic sources ─────────────────────────────────────────────────────
  // One referrer event is recorded per session. Grab the latest for each session.
  const referrerBySession = {};
  events.filter(e => e.event === 'referrer').forEach(e => {
    if (!e.session_id) return;
    referrerBySession[e.session_id] = e;
  });

  // Build source counts: prefer utm_source if present, otherwise referrer_source
  const sourceCounts = {};
  Object.values(referrerBySession).forEach(e => {
    const key = e.utm_source || e.referrer_source || 'direct';
    sourceCounts[key] = (sourceCounts[key] || 0) + 1;
  });
  const sourceEntries = Object.entries(sourceCounts).sort(([, a], [, b]) => b - a);
  const sourceTotal   = sourceEntries.reduce((s, [, c]) => s + c, 0) || 1;

  // Campaign breakdown (when utm_campaign exists)
  const campaignCounts = {};
  Object.values(referrerBySession).forEach(e => {
    if (!e.utm_campaign) return;
    const label = `${e.utm_campaign}${e.utm_medium ? ` (${e.utm_medium})` : ''}`;
    campaignCounts[label] = (campaignCounts[label] || 0) + 1;
  });
  const campaignEntries = Object.entries(campaignCounts).sort(([, a], [, b]) => b - a);

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

  const uniqueVisitors       = sessions.length;
  const uniqueSessionsForEvent = (name) => sessions.filter(s => s.events.some(e => e.event === name)).length;
  const uniqueVideoViewers   = uniqueSessionsForEvent('video_play');
  const uniqueDonateClickers = uniqueSessionsForEvent('donate_click');
  const uniqueDonors         = uniqueSessionsForEvent('donation_completed');
  const uniqueRaffleEntrants = uniqueSessionsForEvent('raffle_entry');

  // ── Device breakdown ─────────────────────────────────────────────────────────
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  sessions.forEach(s => { deviceCounts[s.device_type] = (deviceCounts[s.device_type] || 0) + 1; });
  const deviceTotal = uniqueVisitors || 1;
  const deviceItems = [
    { key: 'desktop', label: 'PC / Desktop', Icon: Monitor,    color: 'bg-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    { key: 'mobile',  label: 'Phone',        Icon: Smartphone, color: 'bg-sky-500',    light: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700'    },
    { key: 'tablet',  label: 'Tablet',       Icon: Tablet,     color: 'bg-violet-500', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  ];

  const funnelMax   = uniqueVisitors || 1;
  const funnelSteps = [
    { label: 'Visited Site',   count: uniqueVisitors,       color: 'bg-indigo-500',  prev: null                 },
    { label: 'Watched Video',  count: uniqueVideoViewers,   color: 'bg-sky-500',     prev: uniqueVisitors       },
    { label: 'Clicked Donate', count: uniqueDonateClickers, color: 'bg-violet-500',  prev: uniqueVideoViewers   },
    { label: 'Donated',        count: uniqueDonors,         color: 'bg-emerald-500', prev: uniqueDonateClickers },
    { label: 'Entered Raffle', count: uniqueRaffleEntrants, color: 'bg-amber-500',   prev: uniqueDonors         },
  ];

  const statCards = [
    { label: 'Site Visitors', value: uniqueVisitors,       sub: `${pageViews.length} page views`,       bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  num: 'text-indigo-900'  },
    { label: 'Video Plays',   value: uniqueVideoViewers,   sub: `${videoPlays.length} plays total`,     bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     num: 'text-sky-900'     },
    { label: 'Donations',     value: uniqueDonors,         sub: `$${totalRaised.toLocaleString()} raised`, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', num: 'text-emerald-900' },
    { label: 'Raffle Entries',value: uniqueRaffleEntrants, sub: `${donateClicks.length} clicks total`,  bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   num: 'text-amber-900'   },
  ];

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#f8f9ff' }}>

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
            <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
              <ArrowLeft size={15} /> Back to Admin
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

          {/* ── Live badge + active visitors ── */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live data
            </span>
            <span className="text-xs text-gray-400">{events.length.toLocaleString()} events · {sessions.length} sessions in this range</span>
            {activeVisitors !== null && (
              <span className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                <span className="text-rose-900 font-extrabold text-sm">{activeVisitors}</span>
                active now
                <span className="text-rose-400 font-normal">(last 5 min)</span>
              </span>
            )}
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

          {/* ── Device Overview ── */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Monitor size={15} className="text-gray-500" />
                <h2 className="text-sm font-bold text-gray-800">Device Overview</h2>
              </div>
              <p className="text-xs text-gray-400 mb-5">How your visitors are accessing the site</p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {deviceItems.map(({ key, label, Icon, color, light, border, text }) => {
                  const count = deviceCounts[key] || 0;
                  const pct   = deviceTotal > 0 ? Math.round((count / deviceTotal) * 100) : 0;
                  return (
                    <div
                      key={key}
                      className={`relative rounded-xl border ${border} ${light} px-4 py-4 cursor-default transition-shadow hover:shadow-md`}
                      onMouseEnter={() => setHoveredDevice(key)}
                      onMouseLeave={() => setHoveredDevice(null)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className={text} />
                        <span className={`text-xs font-semibold ${text}`}>{label}</span>
                      </div>
                      <p className={`text-3xl font-extrabold ${text}`}>{pct}%</p>
                      {/* Hover tooltip */}
                      {hoveredDevice === key && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-gray-900 text-white text-xs font-semibold rounded-lg px-3 py-2 whitespace-nowrap shadow-xl pointer-events-none">
                          {count.toLocaleString()} visit{count !== 1 ? 's' : ''}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Stacked bar */}
              <div className="h-3 rounded-full overflow-hidden flex gap-px">
                {deviceItems.map(({ key, color }) => {
                  const pct = deviceTotal > 0 ? (deviceCounts[key] || 0) / deviceTotal * 100 : 0;
                  return pct > 0 ? <div key={key} className={`${color} h-full transition-all`} style={{ width: `${pct}%` }} /> : null;
                })}
              </div>
              <div className="flex gap-4 mt-3">
                {deviceItems.filter(({ key }) => (deviceCounts[key] || 0) > 0).map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    {label} · {deviceCounts[key]}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Traffic Sources ── */}
          {sourceEntries.length > 0 && (
            <section>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={15} className="text-gray-500" />
                  <h2 className="text-sm font-bold text-gray-800">Traffic Sources</h2>
                </div>
                <p className="text-xs text-gray-400 mb-5">Where your visitors are coming from</p>
                <div className="space-y-3">
                  {sourceEntries.map(([key, count]) => {
                    const meta = sourceMeta(key);
                    const pct  = Math.round((count / sourceTotal) * 100);
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className={`text-xs font-semibold w-28 truncate shrink-0 ${meta.text}`}>{meta.label}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div className={`h-full ${meta.color} rounded transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{count}</span>
                        <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Campaign breakdown */}
                {campaignEntries.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 size={13} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Campaigns (UTM)</span>
                    </div>
                    <div className="space-y-2">
                      {campaignEntries.map(([label, count]) => {
                        const total = campaignEntries.reduce((s, [, c]) => s + c, 0) || 1;
                        const pct   = Math.round((count / total) * 100);
                        return (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-xs text-gray-600 w-40 truncate shrink-0">{label}</span>
                            <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sourceEntries.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No referrer data yet — the migration is required to capture this.</p>
                )}
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
                      const first    = s.events[0];
                      const last     = s.events[s.events.length - 1];
                      const duration = new Date(last.created_at) - new Date(first.created_at);
                      const isOpen   = expandedSession === s.session_id;
                      const pages    = [...new Map(s.events.filter(e => e.event === 'page_view').map(e => [e.page, e])).keys()];

                      return (
                        <div key={s.session_id}>
                          <button
                            onClick={() => setExpandedSession(isOpen ? null : s.session_id)}
                            className="w-full text-left px-6 py-3.5 hover:bg-indigo-50/40 transition flex items-center gap-3"
                          >
                            <span className="w-24 text-xs text-gray-500 shrink-0">{fmtRelative(first.created_at)}</span>
                            <span className="w-36 flex items-center gap-1.5 shrink-0 min-w-0">
                              <DeviceIcon type={s.device_type} />
                              <span className="text-xs text-gray-600 truncate">{s.browser}{s.os ? ` / ${s.os}` : ''}</span>
                            </span>
                            <span className="w-36 text-xs text-gray-500 truncate shrink-0">
                              {s.city && s.country ? `${s.city}, ${s.country}` : s.country || <span className="text-gray-300">—</span>}
                            </span>
                            <span className="flex-1 text-xs text-gray-400 truncate hidden sm:block">
                              {pages.length > 0 ? pages.join(' → ') : (first.page || '—')}
                            </span>
                            <span className="w-28 text-xs text-gray-400 text-right shrink-0">
                              {s.events.length} events · {fmtDuration(duration)}
                            </span>
                            <span className="w-4 text-gray-300 shrink-0">
                              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          </button>

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

// ── Page root (auth-guarded) ──────────────────────────────────────────────────
export default function AnalyticsReportPage() {
  const [session, setSession] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  if (!session) {
    navigate('/admin');
    return null;
  }

  return <AnalyticsContent onBack={() => navigate('/admin')} />;
}
