import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

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

const EMPTY_FORM = { first_name: '', last_name: '', email: '', phone: '', amount: '' };

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
      ? { first_name: entry.first_name || '', last_name: entry.last_name || '', email: entry.email || '', phone: entry.phone || '', amount: entry.amount ?? '' }
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
      String(e.phone      || '').toLowerCase().includes(q)
    );
  });

  const DISPLAY_COLS = ['first_name', 'last_name', 'email', 'phone', 'amount', 'created_at'];
  const LABELS = {
    first_name: 'First Name', last_name: 'Last Name', email: 'Email',
    phone: 'Phone', amount: 'Amount ($)', created_at: 'Date',
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
        <button onClick={onLogout} className="text-xs text-gray-400 hover:text-gray-700 transition">Logout</button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
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
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Loading entries…</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              {search ? 'No entries match your search.' : 'No raffle entries yet.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {DISPLAY_COLS.map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {LABELS[col] || col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr key={entry.id} className={`border-b last:border-0 hover:bg-amber-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    {DISPLAY_COLS.map((col) => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap text-gray-700">{fmt(col, entry[col])}</td>
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
