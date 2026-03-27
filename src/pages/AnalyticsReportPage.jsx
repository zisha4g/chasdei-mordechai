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
  const [selectedSource,   setSelectedSource]   = useState(null);

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
    const pageSize = 1000;
    const rows = [];
    let offset = 0;
    let err = null;

    while (true) {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', dateFrom + 'T00:00:00.000Z')
        .lte('created_at', dateTo   + 'T23:59:59.999Z')
        .order('created_at', { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        err = error;
        break;
      }

      const batch = data || [];
      rows.push(...batch);

      if (batch.length < pageSize) break;
      offset += pageSize;
    }

    setLoading(false);
    if (err) {
      if (err.code === '42P01' || String(err.message).includes('does not exist')) setTableError(true);
      return;
    }
    setEvents(rows);
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

  const sourceDetailRows = selectedSource
    ? Object.values(referrerBySession)
        .filter(e => (e.utm_source || e.referrer_source || 'direct') === selectedSource.key)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8)
    : [];

  const sourceDetailCampaigns = selectedSource
    ? Object.values(referrerBySession)
        .filter(e => (e.utm_source || e.referrer_source || 'direct') === selectedSource.key && e.utm_campaign)
        .reduce((acc, e) => {
          const label = `${e.utm_campaign}${e.utm_medium ? ` (${e.utm_medium})` : ''}`;
          acc[label] = (acc[label] || 0) + 1;
          return acc;
        }, {})
    : {};

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
  const allSessions = Object.values(sessionMap)
    .sort((a, b) => new Date(b.events[0].created_at) - new Date(a.events[0].created_at));

  const visibleSessions = allSessions.slice(0, 100);

  const uniqueVisitors       = allSessions.length;
  const uniqueSessionsForEvent = (name) => allSessions.filter(s => s.events.some(e => e.event === name)).length;
  const uniqueVideoViewers   = uniqueSessionsForEvent('video_play');
  const uniqueDonateClickers = uniqueSessionsForEvent('donate_click');
  const uniqueDonors         = uniqueSessionsForEvent('donation_completed');
  const uniqueRaffleEntrants = uniqueSessionsForEvent('raffle_entry');

  // ── Device breakdown ─────────────────────────────────────────────────────────
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  allSessions.forEach(s => { deviceCounts[s.device_type] = (deviceCounts[s.device_type] || 0) + 1; });
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
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f8f9ff' }}>

      {/* ── Top bar ── */}
      <div className="shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-5 py-3 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <BarChart2 size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">Website Activity</h1>
          </div>
          {/* Date presets inline in the header */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar size={14} className="text-gray-400" />
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
            <span className="text-gray-300 text-sm">|</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={e => { setDateFrom(e.target.value); setActivePreset(null); }}
              className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <span className="text-xs text-gray-400">–</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              max={toDateStr(new Date())}
              onChange={e => { setDateTo(e.target.value); setActivePreset(null); }}
              className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">↻ Refresh</button>
            <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
              <ArrowLeft size={13} /> Back to Admin
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading analytics…</div>
      )}

      {!loading && tableError && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-5xl mb-4">🛠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Analytics table not set up yet</h2>
            <p className="text-sm text-gray-500 mb-3">Run both migrations in your Supabase SQL Editor:</p>
            <p className="text-xs font-mono bg-gray-100 rounded px-3 py-1.5 inline-block mb-1">supabase/migrations/20260324_create_analytics_events.sql</p><br />
            <p className="text-xs font-mono bg-gray-100 rounded px-3 py-1.5 inline-block">supabase/migrations/20260325_add_session_to_analytics.sql</p>
          </div>
        </div>
      )}

      {!loading && !tableError && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4">

          {/* ── Row 1: live badges + stat cards ── */}
          <div className="flex flex-wrap items-stretch gap-4 mb-4">
            {/* Live status pills */}
            <div className="flex flex-col justify-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live · {events.length.toLocaleString()} events
              </span>
              {activeVisitors !== null && (
                <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
                  <span className="text-rose-900 font-extrabold text-sm">{activeVisitors}</span> active now
                </span>
              )}
            </div>
            {/* Stat cards */}
            {statCards.map(({ label, value, sub, bg, border, text, num }) => (
              <div key={label} className={`rounded-xl border ${bg} ${border} px-5 py-4 flex-1 min-w-[130px]`}>
                <p className={`text-3xl font-extrabold leading-tight ${num}`}>{value}</p>
                <p className={`text-sm font-semibold mt-0.5 ${text}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Row 2: Funnel (left) + Chart (right) ── */}
          <div className="grid grid-cols-2 gap-4 mb-4">

            {/* Conversion Funnel */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-0.5">Conversion Funnel</h2>
              <p className="text-xs text-gray-400 mb-4">How visitors moved through your site</p>
              <div className="space-y-3">
                {funnelSteps.map(({ label, count, color, prev }) => {
                  const widthPct = funnelMax > 0 ? Math.max(Math.round((count / funnelMax) * 100), count > 0 ? 2 : 0) : 0;
                  const dropOff  = prev != null && prev > 0 ? Math.round((1 - count / prev) * 100) : null;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-32 text-xs font-semibold text-gray-600 text-right shrink-0">{label}</span>
                      <div className="flex-1 h-7 bg-gray-100 rounded overflow-hidden">
                        <div className={`h-full ${color} rounded flex items-center pl-2.5 transition-all`} style={{ width: `${widthPct}%` }}>
                          {widthPct > 8 && <span className="text-xs font-bold text-white">{count.toLocaleString()}</span>}
                        </div>
                      </div>
                      <span className="w-10 text-xs font-bold text-gray-700 text-right shrink-0">{count.toLocaleString()}</span>
                      <span className="w-12 text-xs text-right shrink-0">{dropOff !== null ? <span className="text-red-400">-{dropOff}%</span> : null}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Activity Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Daily Activity</h2>
                  <p className="text-xs text-gray-400">All events in selected range</p>
                </div>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Live</span>
              </div>
              <div className="flex items-end gap-1.5 h-32">
                {chartBars.map(({ key, label, count }) => (
                  <div key={key} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                    {count > 0 && <span className="text-[10px] font-bold text-indigo-700">{count}</span>}
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${Math.max(count === 0 ? 3 : 5, Math.round((count / barMax) * 100))}px`,
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
          </div>

          {/* ── Row 3: Top Pages + Devices + Sources ── */}
          <div className="grid grid-cols-3 gap-4 mb-4">

            {/* Top Pages */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-0.5">Top Pages</h2>
              <p className="text-xs text-gray-400 mb-4">Most visited in range</p>
              {topPages.length === 0
                ? <p className="text-sm text-gray-400 text-center py-4">No page view data yet.</p>
                : <div className="space-y-2.5">
                    {topPages.map(([path, count]) => (
                      <div key={path} className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-600 w-28 truncate shrink-0">{path}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div className="h-full bg-sky-400 rounded transition-all" style={{ width: `${Math.round((count / pageMax) * 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Device Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-0.5">
                <Monitor size={14} className="text-gray-500" />
                <h2 className="text-sm font-bold text-gray-800">Devices</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4">How visitors access the site</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {deviceItems.map(({ key, label, Icon, color, light, border, text }) => {
                  const count = deviceCounts[key] || 0;
                  const pct   = deviceTotal > 0 ? Math.round((count / deviceTotal) * 100) : 0;
                  return (
                    <div
                      key={key}
                      className={`relative rounded-xl border ${border} ${light} px-3 py-3 cursor-default transition-shadow hover:shadow-md text-center`}
                      onMouseEnter={() => setHoveredDevice(key)}
                      onMouseLeave={() => setHoveredDevice(null)}
                    >
                      <Icon size={16} className={`${text} mx-auto mb-1`} />
                      <p className={`text-xl font-extrabold leading-tight ${text}`}>{pct}%</p>
                      <p className={`text-[10px] font-semibold ${text} leading-tight`}>{label}</p>
                      {hoveredDevice === key && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-gray-900 text-white text-xs font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
                          {count.toLocaleString()} visit{count !== 1 ? 's' : ''}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-3 rounded-full overflow-hidden flex gap-px">
                {deviceItems.map(({ key, color }) => {
                  const pct = deviceTotal > 0 ? (deviceCounts[key] || 0) / deviceTotal * 100 : 0;
                  return pct > 0 ? <div key={key} className={`${color} h-full`} style={{ width: `${pct}%` }} /> : null;
                })}
              </div>
              <div className="flex gap-3 mt-2.5">
                {deviceItems.filter(({ key }) => (deviceCounts[key] || 0) > 0).map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    {label} · {deviceCounts[key]}
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-0.5">
                <Globe size={14} className="text-gray-500" />
                <h2 className="text-sm font-bold text-gray-800">Traffic Sources</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4">Where visitors come from</p>
              {sourceEntries.length === 0
                ? <p className="text-sm text-gray-400 text-center py-4">No referrer data yet.</p>
                : <div className="space-y-2.5">
                    {sourceEntries.map(([key, count]) => {
                      const meta = sourceMeta(key);
                      const pct  = Math.round((count / sourceTotal) * 100);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedSource({ key, count, pct, meta })}
                          className="w-full flex items-center gap-3 rounded-lg px-1 py-1 text-left hover:bg-gray-50 transition"
                        >
                          <span className={`text-xs font-semibold w-20 truncate shrink-0 ${meta.text}`}>{meta.label}</span>
                          <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                            <div className={`h-full ${meta.color} rounded transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-7 text-right shrink-0">{count}</span>
                          <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                        </button>
                      );
                    })}
                  </div>
              }
              {campaignEntries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Share2 size={12} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Campaigns</span>
                  </div>
                  <div className="space-y-2">
                    {campaignEntries.map(([label, count]) => {
                      const total = campaignEntries.reduce((s, [, c]) => s + c, 0) || 1;
                      const pct   = Math.round((count / total) * 100);
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-28 truncate shrink-0">{label}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-7 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 4: Visitor Logs ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Visitor Logs</h2>
                <p className="text-xs text-gray-400">Click a row to expand journey</p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full shrink-0">{allSessions.length} sessions</span>
            </div>

            {allSessions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                {events.length === 0
                  ? 'No visitor data in this date range.'
                  : 'Session tracking not yet active — run the migration to see detailed visitor logs.'}
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  <span className="w-24 shrink-0">Time</span>
                  <span className="w-40 shrink-0">Device</span>
                  <span className="w-36 shrink-0">Location</span>
                  <span className="flex-1">Journey</span>
                  <span className="w-28 text-right shrink-0">Events · Duration</span>
                  <span className="w-4 shrink-0" />
                </div>

                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {visibleSessions.map((s) => {
                    const first    = s.events[0];
                    const last     = s.events[s.events.length - 1];
                    const duration = new Date(last.created_at) - new Date(first.created_at);
                    const isOpen   = expandedSession === s.session_id;
                    const pages    = [...new Map(s.events.filter(e => e.event === 'page_view').map(e => [e.page, e])).keys()];

                    return (
                      <div key={s.session_id}>
                        <button
                          onClick={() => setExpandedSession(isOpen ? null : s.session_id)}
                          className="w-full text-left px-5 py-3 hover:bg-indigo-50/40 transition flex items-center gap-3"
                        >
                          <span className="w-24 text-xs text-gray-500 shrink-0">{fmtRelative(first.created_at)}</span>
                          <span className="w-40 flex items-center gap-1.5 shrink-0 min-w-0">
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
                          <div className="px-5 pb-4 pt-3 bg-indigo-50/30 border-t border-indigo-100">
                            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
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

          {events.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-sm">No events in this date range yet.</p>
            </div>
          )}

          {selectedSource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Traffic Source Detail</p>
                    <h3 className={`mt-1 text-3xl font-extrabold ${selectedSource.meta.text}`}>{selectedSource.meta.label}</h3>
                    <p className="mt-1 text-sm text-gray-500">Click outside the panel or the close button to dismiss.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSource(null)}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>

                <div className="grid gap-4 p-6 lg:grid-cols-[1.2fr_1fr] overflow-y-auto max-h-[calc(90vh-88px)]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Visitors</p>
                        <p className="mt-2 text-4xl font-extrabold text-gray-900">{selectedSource.count}</p>
                        <p className="mt-1 text-sm text-gray-500">{selectedSource.pct}% of all traffic in this date range</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">How it was captured</p>
                        <p className="mt-2 text-lg font-bold text-gray-900">{selectedSource.key === 'direct' ? 'No referrer or UTM tag' : 'UTM source or browser referrer'}</p>
                        <p className="mt-1 text-sm text-gray-500">Use tagged links to make this source easy to verify.</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-800">What this means</h4>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        This row groups sessions by <span className="font-semibold text-gray-900">utm_source</span> first, then by the browser referrer.
                        If you use a campaign link like <span className="font-mono text-gray-900">?utm_source=facebook</span>, it should appear here as <span className="font-semibold text-gray-900">facebook</span>.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-800 mb-3">Example visits</h4>
                      {sourceDetailRows.length === 0 ? (
                        <p className="text-sm text-gray-400">No example rows available for this source.</p>
                      ) : (
                        <div className="space-y-3">
                          {sourceDetailRows.map((row) => (
                            <div key={`${row.session_id}-${row.created_at}`} className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">{fmtRelative(row.created_at)}</span>
                                <span>•</span>
                                <span>{row.page || '/'}</span>
                                {row.utm_campaign && <><span>•</span><span>campaign: {row.utm_campaign}{row.utm_medium ? ` (${row.utm_medium})` : ''}</span></>}
                              </div>
                              <div className="mt-2 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                                <div><span className="font-semibold text-gray-800">utm_source:</span> {row.utm_source || '—'}</div>
                                <div><span className="font-semibold text-gray-800">referrer_source:</span> {row.referrer_source || '—'}</div>
                                <div className="sm:col-span-2"><span className="font-semibold text-gray-800">raw referrer:</span> {row.raw_referrer || '—'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                      <h4 className="text-sm font-bold text-gray-800">Campaign breakdown</h4>
                      <p className="mt-1 text-sm text-gray-500">Only campaigns tied to this source are shown here.</p>
                      <div className="mt-4 space-y-3">
                        {Object.keys(sourceDetailCampaigns).length === 0 ? (
                          <p className="text-sm text-gray-400">No campaign tags were found for this source.</p>
                        ) : (
                          Object.entries(sourceDetailCampaigns)
                            .sort(([, a], [, b]) => b - a)
                            .map(([label, count]) => (
                              <div key={label} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-36 truncate shrink-0">{label}</span>
                                <div className="flex-1 h-4 rounded-full bg-white overflow-hidden border border-gray-200">
                                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.max(6, Math.round((count / Math.max(1, selectedSource.count)) * 100))}%` }} />
                                </div>
                                <span className="text-sm font-bold text-gray-800 w-8 text-right shrink-0">{count}</span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-800">How to make this clearer</h4>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                        <li>Use one clean source name per platform, like <span className="font-mono">facebook</span> or <span className="font-mono">google</span>.</li>
                        <li>Add <span className="font-mono">utm_medium</span> for the channel, like <span className="font-mono">social</span> or <span className="font-mono">cpc</span>.</li>
                        <li>Add <span className="font-mono">utm_campaign</span> for the fundraiser name.</li>
                        <li>Add <span className="font-mono">utm_content</span> if you want to compare different ad creatives.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
