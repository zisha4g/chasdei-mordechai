import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';

const DonatePage = ({ onDonateClick }) => {
  const [selectedAmount, setSelectedAmount] = useState(60);
  const [customAmount, setCustomAmount] = useState(60);
  const donateBoxRef = useRef(null);

  const handleSelectTier = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
  };

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setCustomAmount(val);
      setSelectedAmount(val);
    } else if (e.target.value === '') {
      setCustomAmount('');
    }
  };

  const tiers = [
    { amount: 120, title: 'Feed an Entire Family', desc: 'A full Shabbos table. Fish. Chicken. Kugel. Everything.' },
    { amount: 60, title: 'Fill the Fridge', desc: 'The essentials that turn a week of panic into peace.', popular: true },
    { amount: 12, title: "One Child's Shabbos", desc: 'Ensure one child feels the joy of the day.' },
  ];

  return (
    <div style={{ background: '#0B1A4F', color: '#fff', minHeight: '100vh' }}>
      <Helmet>
        <title>Donate | Chasdei Mordechai</title>
        <meta name="description" content="Make a secure donation to Chasdei Mordechai. Feed a family in crisis." />
      </Helmet>

      {/* Mobile tier layout: first two side-by-side, third full width */}
      <style>{`
        @media (max-width: 640px) {
          .tier-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }
          .tier-card {
            max-width: 100% !important;
            margin: 0 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.25rem !important;
          }
          .tier-card:last-child {
            grid-column: 1 / -1;
            flex-direction: row !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingBottom: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: "url('/images/1000.png')", backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}></div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(110deg, rgba(7,15,48,0.95) 0%, rgba(11,26,79,0.82) 55%, rgba(7,15,48,0.92) 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 0%, rgba(200,20,30,0.15) 0%, transparent 60%)' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', padding: '0 7%', paddingTop: '72px', textAlign: 'center', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(242,223,168,0.09)', border: '1px solid rgba(242,223,168,0.27)', color: '#F2DFA8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '0.4rem 1.1rem', borderRadius: '100px', marginBottom: '2rem' }}>
            Make a Difference Today
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(3.8rem,9.5vw,9rem)', color: '#FFFFFF', lineHeight: 0.92, letterSpacing: '2px', fontWeight: 700, margin: '0 0 1.8rem 0' }}>
            SHABBOS IS COMING.<br />HER FRIDGE<br />
            <span style={{ color: '#F2DFA8', textShadow: '0 0 30px rgba(242,223,168,0.4), 0 0 60px rgba(242,223,168,0.15)' }}>IS EMPTY.</span>
          </h1>
          {/* Donate button immediately after heading — Task 7 */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <button
              onClick={() => donateBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              style={{ display: 'inline-block', background: '#F2DFA8', color: '#0B1A4F', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '1rem 2.5rem', borderRadius: '100px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', transition: 'all 0.22s ease', whiteSpace: 'nowrap', fontFamily: "'Inter',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5CA7A'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F2DFA8'; e.currentTarget.style.transform = ''; }}
            >
              Donate Now →
            </button>
          </div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, maxWidth: '510px', margin: '0 auto 2.8rem' }}>
            A mother stands before an empty fridge, calculating how to make Shabbos this week. She hides her panic with a smile, even as her children ask, <em>"Is there more chicken?"</em> or <em>"Can I have more sweet potato?"</em><br /><br />
            <strong style={{ color: '#fff' }}>Hashem placed this moment in your hands.</strong><br />
            You are the power to say "YES" to them.
          </p>
        </div>
      </section>

      {/* "This Is Where You Step In" merged into donation section */}
      <div style={{background:'#070F30', padding:'3rem 6% 0'}}>
        <div style={{maxWidth:'720px', margin:'0 auto', textAlign:'center'}}>
          <h2 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(2rem,4.5vw,3.2rem)', color:'#F2DFA8', letterSpacing:'1px', fontWeight:700, marginBottom:'1.25rem'}}>
            THIS IS WHERE YOU STEP IN.
          </h2>
          <div style={{width:'56px', height:'3px', background:'rgba(242,223,168,0.45)', borderRadius:'100px', margin:'0 auto 1.75rem'}}></div>
          <p style={{fontSize:'1.05rem', color:'rgba(255,255,255,0.62)', lineHeight:1.85, fontFamily:"'Inter',sans-serif"}}>
            <strong style={{color:'#fff'}}>Hundreds of donors have already said: "I won't let a family face Shabbos like this."</strong>
          </p>
        </div>
      </div>

      {/* Donation tiers + CTA */}
      <section style={{ background: '#070F30', padding: '2.5rem 6% 7rem' }} id="give">
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div className="tier-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {tiers.map(tier => {
              const isSel = selectedAmount === tier.amount;
              return (
                <div
                  key={tier.amount}
                  className="tier-card"
                  onClick={() => handleSelectTier(tier.amount)}
                  style={{ background: isSel ? 'rgba(242,223,168,0.08)' : 'rgba(255,255,255,0.06)', border: isSel ? '1.5px solid #F2DFA8' : '1.5px solid rgba(255,255,255,0.10)', borderRadius: '22px', padding: '1.5rem 1.75rem', cursor: 'pointer', transition: 'all 0.25s ease', position: 'relative', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', boxShadow: isSel ? '0 0 0 3px rgba(242,223,168,0.16), 0 20px 60px rgba(0,0,0,0.28)' : 'none', maxWidth: '660px', margin: '0 auto' }}
                  onMouseEnter={e => { if (!isSel) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = '#F2DFA8'; e.currentTarget.style.transform = 'translateY(-4px)'; } }}
                  onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = ''; } }}
                >
                  {tier.popular && (
                    <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#F2DFA8', color: '#0B1A4F', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: '100px', whiteSpace: 'nowrap', fontFamily: "'Inter',sans-serif" }}>
                      Most Popular
                    </div>
                  )}
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2.5rem', color: '#FFFFFF', lineHeight: 1, fontWeight: 400, minWidth: '80px' }}>${tier.amount}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#F2DFA8', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Inter',sans-serif" }}>{tier.title}</div>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontFamily: "'Inter',sans-serif" }}>{tier.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={donateBoxRef} style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.14)', borderRadius: '26px', padding: '2.5rem 3rem', textAlign: 'center', backdropFilter: 'blur(10px)', maxWidth: '660px', margin: '0 auto' }}>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={handleCustomChange}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '100px', color: '#FFFFFF', fontSize: '1.05rem', fontFamily: "'Inter',sans-serif", fontWeight: 600, padding: '0.9rem 1.5rem', marginBottom: '1.25rem', outline: 'none', textAlign: 'center', transition: 'border-color 0.2s', display: 'block', MozAppearance: 'textfield' }}
              onFocus={e => e.target.style.borderColor = '#F2DFA8'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            {/* Button text updated — Task 11; secured checkout removed — Task 8 */}
            <button
              onClick={() => onDonateClick(selectedAmount)}
              style={{ width: '100%', background: '#F2DFA8', color: '#0B1A4F', fontSize: '1rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', padding: '1.1rem', borderRadius: '100px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.22)', transition: 'all 0.22s ease', fontFamily: "'Inter',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5CA7A'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F2DFA8'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)'; }}
            >
              Yes, I Will Be The Answer
            </button>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '1rem', lineHeight: 1.75, marginTop: '2rem', fontFamily: "'Inter',sans-serif" }}>
            It takes less than a minute. But for this mother, it changes the entire week.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
  
