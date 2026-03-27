import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRaffle } from '@/contexts/RaffleContext';

// ── Confetti (matches designer HTML exactly) ──────────────────────────────────
function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#C8141E','#F2DFA8','#FFFFFF','#1040B8','#E5CA7A','#A50F18'];
    const pieces = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      w: Math.random() * 10 + 5, h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 1.5, angle: Math.random() * 360,
      spin: Math.random() * 5 - 2.5, opacity: Math.random() * 0.6 + 0.4,
    }));
    let frame = 0, raf;
    function draw() {
      if (frame > 230) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed; p.angle += p.spin; p.opacity -= 0.003;
        if (p.opacity < 0) p.opacity = 0;
        ctx.save(); ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y); ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
const ThankYouPage = ({ requireDonation = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params   = new URLSearchParams(location.search);
  const rawName  = params.get('name') || '';
  const safeName = /^[a-zA-Z\s'-]{1,50}$/.test(rawName) ? rawName : 'FRIEND';
  const rawAmt   = parseFloat(params.get('amount'));
  const amount   = rawAmt > 0 && rawAmt < 100000 ? rawAmt : null;

  const { openRaffle } = useRaffle();
  const donor = location.state?.donor || null;

  useEffect(() => {
    if (!requireDonation) return;
    // Require the router state object set by handleDonationSuccess —
    // the URL params alone are not sufficient because they persist in
    // browser history and would let a back-button press re-show this page.
    if (!donor) {
      navigate('/donate', { replace: true });
    }
  }, [requireDonation, donor, navigate]);

  if (requireDonation && !donor) {
    return null;
  }

  const [nlDone,    setNlDone]    = useState(false);
  const [copyLabel, setCopyLabel] = useState('🔗 Copy Link');

  const shareWA = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    window.open('https://wa.me/?text=' + encodeURIComponent('I just donated to Chasdei Mordechai. Join me: ' + url + '/donate'), '_blank', 'noopener,noreferrer');
  };
  const copyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.origin + '/donate' : '';
    navigator.clipboard.writeText(url).then(() => {
      setCopyLabel('✓ Copied!');
      setTimeout(() => setCopyLabel('🔗 Copy Link'), 2500);
    });
  };

  return (
    <>
      <Helmet>
        <title>Thank You | Chasdei Mordechai</title>
        <meta name="description" content="Thank you for supporting Chasdei Mordechai." />
      </Helmet>

      <Confetti />

      {/* keyframes injected once */}
      <style>{`
        @keyframes tyPopIn  { 0%{transform:scale(0);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes tyFadeUp { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ padding: '11rem 6% 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        {/* Red radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(200,20,30,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          {/* Checkmark circle */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(200,20,30,0.12)', border: '2px solid rgba(200,20,30,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem', fontSize: '2.5rem', color: '#fff',
            animation: 'tyPopIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}>✓</div>

          {/* Main heading */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#fff',
              letterSpacing: 2, lineHeight: 0.95, marginBottom: '1.75rem',
              textTransform: 'uppercase',
              animation: 'tyFadeUp 0.7s ease 0.15s both',
            }}
          >
            YOU DID IT,<br />
            <span style={{ color: '#F2DFA8' }} dir="auto">{safeName.toUpperCase()}</span>!
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.80)',
            lineHeight: 1.8, marginBottom: '1rem',
            animation: 'tyFadeUp 0.7s ease 0.25s both',
          }}>
            You just replaced a father's nightmare with a table full of food and a heart full of hope.
          </p>

          {/* Gift badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(200,20,30,0.15)', border: '1.5px solid rgba(200,20,30,0.45)',
            borderRadius: 100, padding: '0.7rem 1.75rem', margin: '1.5rem 0 2.5rem',
            animation: 'tyFadeUp 0.7s ease 0.35s both',
          }}>
            <p className="font-display" style={{ fontSize: '1.6rem', color: '#F2DFA8', letterSpacing: 1, margin: 0, textTransform: 'uppercase' }}>
              {amount ? `Your Gift of $${amount.toFixed(2)}` : 'Your Gift Was Received'}
            </p>
            <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginTop: '0.1rem' }}>
              Thank You · Tizku L'Mitzvos
            </span>
          </div>

          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem' }}>
            A confirmation email is on its way to you.
          </p>

          {/* Raffle CTA — always visible in hero, no scroll needed */}
          <div style={{ animation: 'tyFadeUp 0.7s ease 0.5s both' }}>
            <button
              onClick={() => openRaffle(donor)}
              style={{
                background: '#E8CC74', color: '#091031',
                fontSize: '1rem', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase',
                padding: '1rem 2.5rem', borderRadius: 100, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(232,204,116,0.35)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1D989'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E8CC74'; e.currentTarget.style.transform = ''; }}
            >
              🎟️ Enter Raffle Now
            </button>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem', marginTop: '0.6rem' }}>
              Win $1,000 — free for every donor
            </p>
          </div>
        </div>
      </div>

      {/* ── STORY CARD ── */}
      <div style={{ padding: '3.5rem 6%', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: 26, padding: '2.5rem 3rem', textAlign: 'center',
        }}>
          <h2 className="font-display" style={{ fontSize: '2rem', color: '#fff', letterSpacing: 1, marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            WHAT YOU JUST DID FOR CHAIM
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.1rem' }}>
            Because of your kindness, Chaim can put his worries aside and{' '}
            <em style={{ fontStyle: 'italic', color: '#F2DFA8' }}>sing Zemiros with his children in true simcha.</em>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.1rem' }}>
            When Chaim lost his job, he lost more than a paycheck. He lost the pride of being a provider. He lost the ability to stand tall at his own Shabbos table.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.85, marginBottom: 0 }}>
            <strong style={{ color: '#fff' }}>But today, you gave it back to him.</strong>
          </p>
        </div>
      </div>

      {/* ── RAFFLE ENTRY ── */}
      <div style={{ padding: '0 6% 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(232,204,116,0.12) 0%, rgba(232,204,116,0.05) 100%)',
          border: '1.5px solid rgba(232,204,116,0.35)',
          borderRadius: 26, padding: '2rem 2.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem',
          justifyContent: 'space-between',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h4 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.6rem', color: '#F2DFA8', letterSpacing: 1, margin: '0 0 0.4rem', textTransform: 'uppercase' }}>
              Don't forget your raffle entry!
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', margin: 0 }}>
              As a thank you, you're eligible to win <strong style={{ color: '#fff' }}>$1,000</strong>. Enter for free below.
            </p>
          </div>
          <button
            onClick={() => openRaffle(donor)}
            style={{
              background: '#E8CC74', color: '#091031', fontSize: '0.92rem', fontWeight: 800,
              letterSpacing: '1px', textTransform: 'uppercase', padding: '0.9rem 2rem',
              borderRadius: 100, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 6px 24px rgba(0,0,0,0.25)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1D989'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#E8CC74'; }}
          >
            🎟️ Enter Raffle Now
          </button>
        </div>
      </div>

      {/* ── JOIN THE FAMILY — white card ── */}
      <div style={{ padding: '2rem 6% 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          background: '#fff', borderRadius: 26, padding: '3rem 2.5rem', textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💌</div>
          <h3 className="font-display" style={{ fontSize: '2.2rem', color: '#091031', letterSpacing: 1, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Join the Family
          </h3>
          <p style={{ color: '#4B5563', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Don't let the connection end here. Receive monthly family updates and see exactly how your generosity continues to restore homes, tables, and hearts.
          </p>
          {nlDone ? (
            <p style={{ color: '#15803D', fontWeight: 700 }}>✓ You're in the family!</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setNlDone(true); }} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="email" placeholder="Your email address" required
                style={{ flex: 1, minWidth: 180, background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 100, color: '#111', fontSize: '0.95rem', fontWeight: 500, padding: '0.85rem 1.5rem', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#091031', color: '#fff', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0.85rem 1.75rem', borderRadius: 100, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Join Family Updates
              </button>
            </form>
          )}
          <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '1rem', marginBottom: 0 }}>
            No spam. Unsubscribe anytime. Just the stories that matter.
          </p>
        </div>
      </div>

      {/* ── SHARE ── */}
      <div style={{ textAlign: 'center', padding: '0 6% 2rem', position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Spread the Word
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={shareWA} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 100, color: '#fff', fontSize: '0.88rem', fontWeight: 600, padding: '0.7rem 1.5rem', cursor: 'pointer' }}>
            📱 Share on WhatsApp
          </button>
          <button onClick={copyLink} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 100, color: '#fff', fontSize: '0.88rem', fontWeight: 600, padding: '0.7rem 1.5rem', cursor: 'pointer' }}>
            {copyLabel}
          </button>
        </div>
      </div>

      {/* ── RETURN LINK ── */}
      <div style={{ textAlign: 'center', padding: '1rem 6% 4rem', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', textDecoration: 'none' }}>
          ← Return to Home
        </Link>
      </div>
    </>
  );
};

export default ThankYouPage;