
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
    if (!isNaN(val) && val > 0) { setCustomAmount(val); setSelectedAmount(val); }
    else if (e.target.value === '') setCustomAmount('');
  };

  const tiers = [
    { amount: 120, title: 'Feed an Entire Family', desc: 'A full Shabbos table. Fish. Chicken. Kugel. Everything a family of eight needs.' },
    { amount: 60,  title: 'Fill the Fridge',       desc: 'The essentials that turn a week of panic into peace.', popular: true },
    { amount: 12,  title: "One Child's Shabbos",   desc: 'Ensure one child feels the full joy of the holy day.' },
  ];

  return (
    <div style={{background:'#0B1A4F', color:'#fff', minHeight:'100vh'}}>
      <style>{`
        @media (max-width: 640px) {
          .dp-hero { min-height: auto !important; padding-bottom: 1.5rem !important; }
          .dp-hero-content { padding-top: 72px !important; padding-left: 5% !important; padding-right: 5% !important; }
          .dp-hero-content h1 { font-size: 3.2rem !important; margin-bottom: 1rem !important; }
          .dp-hero-content p { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
          .dp-story-band { padding: 2.5rem 5% !important; }
          .dp-story-band h2 { font-size: 1.8rem !important; }
          .dp-story-band p { font-size: 0.93rem !important; }
          .dp-cards-section { padding: 2.5rem 5% !important; }
          .dp-cards-section h2 { font-size: 2rem !important; margin-bottom: 0.5rem !important; }
          .dp-cards-grid { display: flex !important; overflow-x: auto !important; gap: 1rem !important; padding-bottom: 1rem !important; scroll-snap-type: x mandatory !important; -webkit-overflow-scrolling: touch !important; margin-bottom: 1.5rem !important; }
          .dp-card { min-width: 70vw !important; flex-shrink: 0 !important; scroll-snap-align: start !important; }
          .dp-card-img { height: 140px !important; }
          .dp-tiers-section { padding: 3rem 5% !important; }
          .dp-tiers-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .dp-donate-box { position: static !important; order: -1 !important; }
          .dp-tier-list { order: 1 !important; }
          .dp-tier-row { padding: 1rem 1.25rem !important; }
          .dp-tier-amount { font-size: 1.9rem !important; min-width: 60px !important; }
        }
      `}</style>
      <Helmet>
        <title>Donate | Chasdei Mordechai</title>
        <meta name="description" content="Make a secure donation to Chasdei Mordechai. Feed a family in crisis." />
      </Helmet>

      {/* ── HERO ── */}
      <section className="dp-hero" style={{position:'relative', minHeight:'75vh', display:'flex', alignItems:'center', overflow:'hidden', paddingBottom:'3rem'}}>
        <div style={{position:'absolute', inset:0, zIndex:0, backgroundImage:"url('/images/donate-top.png')", backgroundSize:'cover', backgroundPosition:'center top', backgroundRepeat:'no-repeat'}}></div>
        <div style={{position:'absolute', inset:0, zIndex:0, background:'linear-gradient(110deg, rgba(7,15,48,0.95) 0%, rgba(11,26,79,0.82) 55%, rgba(7,15,48,0.92) 100%)'}}></div>
        <div style={{position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 0%, rgba(200,20,30,0.15) 0%, transparent 60%)'}}></div>

        <div className="dp-hero-content" style={{position:'relative', zIndex:2, maxWidth:'960px', padding:'0 7%', paddingTop:'72px', textAlign:'center', margin:'0 auto', width:'100%'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(242,223,168,0.09)', border:'1px solid rgba(242,223,168,0.27)', color:'#F2DFA8', fontSize:'0.75rem', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', padding:'0.4rem 1.1rem', borderRadius:'100px', marginBottom:'2rem'}}>
            Make a Difference Today
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(3.8rem,9.5vw,9rem)', color:'#FFFFFF', lineHeight:0.92, letterSpacing:'2px', fontWeight:700, margin:'0 0 1.8rem 0'}}>
            SHABBOS IS COMING.<br />HER FRIDGE<br />
            <span style={{color:'#F2DFA8', textShadow:'0 0 30px rgba(242,223,168,0.4), 0 0 60px rgba(242,223,168,0.15)'}}>IS EMPTY.</span>
          </h1>
          <p style={{fontFamily:"'Inter',sans-serif", fontSize:'clamp(1rem,1.8vw,1.2rem)', color:'rgba(255,255,255,0.78)', lineHeight:1.85, maxWidth:'510px', margin:'0 auto 2.8rem'}}>
            A mother stands before an empty fridge, calculating how to make Shabbos this week.<br /><br />
            <strong style={{color:'#fff'}}>Hashem placed this moment in your hands.</strong><br />
            You are the power to say YES.
          </p>
          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', justifyContent:'center', marginBottom:'2rem'}}>
            <button
              onClick={() => donateBoxRef.current?.scrollIntoView({behavior:'smooth', block:'center'})}
              style={{display:'inline-block', background:'#F2DFA8', color:'#0B1A4F', fontSize:'0.95rem', fontWeight:900, letterSpacing:'1.5px', textTransform:'uppercase', padding:'1rem 2.5rem', borderRadius:'100px', border:'none', cursor:'pointer', boxShadow:'0 8px 32px rgba(0,0,0,0.3)', transition:'all 0.22s ease', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif"}}
              onMouseEnter={e => { e.currentTarget.style.background='#E5CA7A'; e.currentTarget.style.transform='translateY(-3px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#F2DFA8'; e.currentTarget.style.transform=''; }}
            >
              Donate Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── GRADIENT FADE ── */}
      <div style={{height:'80px', background:'linear-gradient(to bottom, #0B1A4F, #070F30)'}}></div>

      {/* ── STORY BAND ── */}
      <div className="dp-story-band" style={{background:'#070F30', padding:'5.5rem 6%', borderBottom:'1px solid rgba(255,255,255,0.10)'}}>
        <div style={{maxWidth:'720px', margin:'0 auto', textAlign:'center'}}>
          <div style={{display:'inline-block', background:'rgba(200,20,30,0.12)', color:'#F2DFA8', border:'1px solid rgba(200,20,30,0.30)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', padding:'0.4rem 1rem', borderRadius:'100px', marginBottom:'1.5rem', fontFamily:"'Inter',sans-serif"}}>
            Her Story
          </div>
          <h2 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(2rem,4.5vw,3.2rem)', color:'#FFFFFF', letterSpacing:'1px', fontWeight:700, marginBottom:'1.25rem'}}>
            THIS IS WHERE YOU STEP IN.
          </h2>
          <p style={{fontSize:'1.05rem', color:'rgba(255,255,255,0.62)', lineHeight:1.85, marginBottom:'1.1rem', fontFamily:"'Inter',sans-serif"}}>
            She hides her panic with a smile, even as her children ask, <em>"Is there more chicken?"</em> or <em>"Can I have more sweet potato?"</em>
          </p>
          <div style={{width:'56px', height:'3px', background:'#C8141E', borderRadius:'100px', margin:'1.75rem auto'}}></div>
          <p style={{fontSize:'1.05rem', color:'rgba(255,255,255,0.62)', lineHeight:1.85, marginBottom:'1.1rem', fontFamily:"'Inter',sans-serif"}}>
            <strong style={{color:'#fff'}}>Hundreds of donors have already said: "I won't let a family face Shabbos like this."</strong>
          </p>
          <p style={{fontSize:'1.05rem', color:'rgba(255,255,255,0.62)', lineHeight:1.85, fontFamily:"'Inter',sans-serif"}}>
            It takes less than a minute. But for this mother, it changes the entire week.
          </p>
        </div>
      </div>

      {/* ── 3 PHOTO CARDS ── */}
      <section className="dp-cards-section" style={{background:'#0B1A4F', padding:'6rem 6%'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'3rem'}}>
            <h2 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(2.5rem,5vw,4.2rem)', color:'#FFFFFF', letterSpacing:'1px', fontWeight:700, lineHeight:1, margin:'0 0 0.75rem 0'}}>
              THIS IS WHERE YOU STEP IN.
            </h2>
            <p style={{color:'rgba(255,255,255,0.62)', fontSize:'1.05rem', fontFamily:"'Inter',sans-serif"}}>
              Hundreds of donors have already said, "I won't let a family face Shabbos like this."
            </p>
          </div>

          <div className="dp-cards-grid" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'3rem'}}>
            {/* $120 */}
            <div
              className="dp-card"
              onClick={() => { handleSelectTier(120); donateBoxRef.current?.scrollIntoView({behavior:'smooth', block:'center'}); }}
              style={{background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.10)', borderRadius:'28px', overflow:'hidden', cursor:'pointer', transition:'all 0.3s ease', display:'flex', flexDirection:'column'}}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor='#F2DFA8'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; }}
            >
              <div className="dp-card-img" style={{height:'192px', overflow:'hidden', position:'relative'}}>
                <img src="/images/donate-120.png" alt="Family at Shabbos table" style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease'}}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.10)'}
                  onMouseLeave={e => e.currentTarget.style.transform=''}
                />
                <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent'}}></div>
                <div style={{position:'absolute', bottom:'1rem', left:'1rem'}}>
                  <span style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.5rem', color:'#fff', fontWeight:400}}>$120</span>
                </div>
              </div>
              <div style={{padding:'1.5rem', flexGrow:1, display:'flex', flexDirection:'column'}}>
                <h3 style={{fontWeight:700, color:'#fff', fontSize:'1.1rem', marginBottom:'0.5rem', fontFamily:"'Inter',sans-serif"}}>Feed an Entire Family</h3>
                <p style={{color:'rgba(255,255,255,0.62)', fontSize:'0.95rem', lineHeight:1.65, flexGrow:1, margin:'0 0 1rem 0', fontFamily:"'Inter',sans-serif"}}>A full Shabbos table. Fish. Chicken. Kugel. Everything.</p>
                <div style={{color:'#F2DFA8', fontWeight:600, fontSize:'0.9rem', fontFamily:"'Inter',sans-serif"}}>Select →</div>
              </div>
            </div>

            {/* $60 — Popular */}
            <div
              className="dp-card"
              onClick={() => { handleSelectTier(60); donateBoxRef.current?.scrollIntoView({behavior:'smooth', block:'center'}); }}
              style={{background:'rgba(242,223,168,0.08)', border:'1.5px solid #F2DFA8', borderRadius:'28px', overflow:'hidden', cursor:'pointer', transition:'all 0.3s ease', display:'flex', flexDirection:'column', position:'relative', boxShadow:'0 0 0 3px rgba(242,223,168,0.16)'}}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(242,223,168,0.16), 0 24px 60px rgba(0,0,0,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 0 0 3px rgba(242,223,168,0.16)'; }}
            >
              <div style={{position:'absolute', top:'1rem', right:'1rem', zIndex:10, background:'#F2DFA8', color:'#0B1A4F', fontSize:'0.68rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:'100px', fontFamily:"'Inter',sans-serif"}}>
                Most Popular
              </div>
              <div className="dp-card-img" style={{height:'192px', overflow:'hidden', position:'relative'}}>
                <img src="/images/donate-60.png" alt="Children sharing food and joy" style={{width:'100%', height:'100%', objectFit:'cover', opacity:0.85, transition:'transform 0.5s ease'}}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.10)'}
                  onMouseLeave={e => e.currentTarget.style.transform=''}
                />
                <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(9,16,49,0.85), rgba(9,16,49,0.4) 50%, transparent)'}}></div>
                <div style={{position:'absolute', bottom:'1rem', left:'1rem'}}>
                  <span style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.8rem', color:'#fff', fontWeight:400}}>$60</span>
                </div>
              </div>
              <div style={{padding:'1.5rem', flexGrow:1, display:'flex', flexDirection:'column'}}>
                <h3 style={{fontWeight:700, color:'#fff', fontSize:'1.1rem', marginBottom:'0.5rem', fontFamily:"'Inter',sans-serif"}}>Fill the Fridge</h3>
                <p style={{color:'rgba(255,255,255,0.62)', fontSize:'0.95rem', lineHeight:1.65, flexGrow:1, margin:'0 0 1rem 0', fontFamily:"'Inter',sans-serif"}}>The essentials that turn a week of panic into peace.</p>
                <div style={{color:'#F2DFA8', fontWeight:600, fontSize:'0.9rem', fontFamily:"'Inter',sans-serif"}}>Select →</div>
              </div>
            </div>

            {/* $12 */}
            <div
              className="dp-card"
              onClick={() => { handleSelectTier(12); donateBoxRef.current?.scrollIntoView({behavior:'smooth', block:'center'}); }}
              style={{background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.10)', borderRadius:'28px', overflow:'hidden', cursor:'pointer', transition:'all 0.3s ease', display:'flex', flexDirection:'column'}}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor='#F2DFA8'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; }}
            >
              <div className="dp-card-img" style={{height:'192px', overflow:'hidden', position:'relative'}}>
                <img src="/images/donate-12.png" alt="One child's Shabbos" style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease'}}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.10)'}
                  onMouseLeave={e => e.currentTarget.style.transform=''}
                />
                <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'}}></div>
                <div style={{position:'absolute', bottom:'1rem', left:'1rem'}}>
                  <span style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.5rem', color:'#fff', fontWeight:400}}>$12</span>
                </div>
              </div>
              <div style={{padding:'1.5rem', flexGrow:1, display:'flex', flexDirection:'column'}}>
                <h3 style={{fontWeight:700, color:'#fff', fontSize:'1.1rem', marginBottom:'0.5rem', fontFamily:"'Inter',sans-serif"}}>One Child's Shabbos</h3>
                <p style={{color:'rgba(255,255,255,0.62)', fontSize:'0.95rem', lineHeight:1.65, flexGrow:1, margin:'0 0 1rem 0', fontFamily:"'Inter',sans-serif"}}>Ensure one child feels the full joy of the day.</p>
                <div style={{color:'#F2DFA8', fontWeight:600, fontSize:'0.9rem', fontFamily:"'Inter',sans-serif"}}>Select →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIERS + DONATE BOX ── */}
      <section className="dp-tiers-section" style={{background:'#070F30', padding:'7rem 6%'}} id="give">
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div className="dp-tiers-grid" style={{display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'5rem', alignItems:'start'}}>

            {/* Left — tier list */}
            <div className="dp-tier-list">
              <div style={{display:'inline-block', background:'rgba(200,20,30,0.12)', color:'#F2DFA8', border:'1px solid rgba(200,20,30,0.30)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', padding:'0.4rem 1rem', borderRadius:'100px', marginBottom:'1.5rem', fontFamily:"'Inter',sans-serif"}}>
                Choose Your Impact
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(2.2rem,4vw,3.5rem)', color:'#FFFFFF', letterSpacing:'1px', lineHeight:1, fontWeight:700, marginBottom:'1rem'}}>
                WHAT DOES YOUR <span style={{color:'#F2DFA8'}}>GIFT</span> DO?
              </h2>
              <p style={{color:'rgba(255,255,255,0.62)', fontSize:'0.98rem', lineHeight:1.75, marginBottom:'2rem', fontFamily:"'Inter',sans-serif"}}>
                Every amount transforms a family's Shabbos and restores their dignity.
              </p>

              <div style={{display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2.5rem'}}>
                {tiers.map(tier => {
                  const isSel = selectedAmount === tier.amount;
                  return (
                    <div
                      key={tier.amount}
                      onClick={() => handleSelectTier(tier.amount)}
                      className="dp-tier-row"
                    style={{background: isSel ? 'rgba(242,223,168,0.08)' : 'rgba(255,255,255,0.06)', border: isSel ? '1.5px solid #F2DFA8' : '1.5px solid rgba(255,255,255,0.10)', borderRadius:'22px', padding:'1.5rem 1.75rem', cursor:'pointer', transition:'all 0.25s ease', position:'relative', display:'flex', gap:'1.5rem', alignItems:'flex-start', boxShadow: isSel ? '0 0 0 3px rgba(242,223,168,0.16), 0 20px 60px rgba(0,0,0,0.28)' : 'none'}}
                      onMouseEnter={e => { if (!isSel) { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='#F2DFA8'; e.currentTarget.style.transform='translateY(-4px)'; } }}
                      onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.transform=''; } }}
                    >
                      {tier.popular && (
                        <div style={{position:'absolute', top:'-13px', left:'50%', transform:'translateX(-50%)', background:'#F2DFA8', color:'#0B1A4F', fontSize:'0.68rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:'100px', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif"}}>
                          Most Popular
                        </div>
                      )}
                      <div className="dp-tier-amount" style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.5rem', color:'#FFFFFF', lineHeight:1, fontWeight:400, minWidth:'80px'}}>${tier.amount}</div>
                      <div>
                        <div style={{fontWeight:700, color:'#F2DFA8', fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'0.5rem', fontFamily:"'Inter',sans-serif"}}>{tier.title}</div>
                        <p style={{color:'rgba(255,255,255,0.55)', fontSize:'0.95rem', lineHeight:1.65, margin:0, fontFamily:"'Inter',sans-serif"}}>{tier.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social proof */}
              <div style={{padding:'1.5rem', background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'16px'}}>
                <div style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.8rem', color:'#F2DFA8', lineHeight:1, fontWeight:400}}>847+</div>
                <div style={{color:'rgba(255,255,255,0.38)', fontSize:'0.85rem', marginTop:'0.2rem', fontFamily:"'Inter',sans-serif"}}>Families helped this year alone</div>
              </div>
            </div>

            {/* Right — sticky donate box */}
            <div className="dp-donate-box" style={{position:'sticky', top:'88px'}}>
              <div ref={donateBoxRef} style={{background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.14)', borderRadius:'26px', padding:'2.5rem 3rem', textAlign:'center', backdropFilter:'blur(10px)'}}>
                <h3 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.2rem', color:'#FFFFFF', letterSpacing:'1px', marginBottom:'1.5rem', fontWeight:700}}>
                  YES. I WILL BE THE ANSWER.
                </h3>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={handleCustomChange}
                  style={{width:'100%', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.15)', borderRadius:'100px', color:'#FFFFFF', fontSize:'1.05rem', fontFamily:"'Inter',sans-serif", fontWeight:600, padding:'0.9rem 1.5rem', marginBottom:'1.25rem', outline:'none', textAlign:'center', transition:'border-color 0.2s', display:'block', MozAppearance:'textfield'}}
                  onFocus={e => e.target.style.borderColor='#F2DFA8'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.15)'}
                />
                <button
                  onClick={() => onDonateClick(selectedAmount)}
                  style={{width:'100%', background:'#F2DFA8', color:'#0B1A4F', fontSize:'1rem', fontWeight:900, letterSpacing:'2px', textTransform:'uppercase', padding:'1.1rem', borderRadius:'100px', border:'none', cursor:'pointer', boxShadow:'0 8px 32px rgba(0,0,0,0.22)', transition:'all 0.22s ease', fontFamily:"'Inter',sans-serif"}}
                  onMouseEnter={e => { e.currentTarget.style.background='#E5CA7A'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#F2DFA8'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.22)'; }}
                >
                  Donate Now →
                </button>
                <p style={{color:'rgba(255,255,255,0.25)', fontSize:'0.78rem', marginTop:'1rem', fontFamily:"'Inter',sans-serif"}}>🔒 Secure · 501(c)(3) · Tax-deductible</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default DonatePage;
