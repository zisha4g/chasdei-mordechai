
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onDonateClick }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(60);
  const [customAmount, setCustomAmount] = useState(60);
  const [showVideoChoice, setShowVideoChoice] = useState(false);
  const donateSectionRef = useRef(null);

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
    setTimeout(() => {
      donateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const handleCustomAmountChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setCustomAmount(val);
      setSelectedAmount(val);
    } else if (e.target.value === '') {
      setCustomAmount('');
    }
  };

  return (
    <div style={{background:'#0B1A4F', color:'#fff', minHeight:'100vh'}}>
      <Helmet>
        <title>Chasdei Mordechai | Restoring Dignity</title>
        <meta name="description" content="When Shabbos approaches and the fridge is empty, your gift restores peace, dignity, and a full table." />
      </Helmet>

      {/* Video / Donate choice modal */}
      {showVideoChoice && (
        <div style={{position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.82)', backdropFilter:'blur(6px)', padding:'0 1rem'}}>
          <div style={{width:'100%', maxWidth:'560px', borderRadius:'2.5rem', border:'1.5px solid rgba(255,255,255,0.15)', background:'linear-gradient(160deg,#101a4d 0%,#0b1640 100%)', padding:'3rem 2.5rem', textAlign:'center', boxShadow:'0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,204,116,0.08)'}}>
            {/* Badge */}
            <div style={{display:'inline-block', background:'rgba(200,20,30,0.18)', border:'1px solid rgba(200,20,30,0.45)', borderRadius:'100px', padding:'0.35rem 1.1rem', marginBottom:'1.25rem'}}>
              <span style={{color:'#f87171', fontSize:'0.78rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase'}}>Anxiety Is Real</span>
            </div>
            <h2 style={{marginBottom:'0.75rem', fontSize:'1.65rem', fontWeight:800, color:'#fff', lineHeight:1.25}}>Before You Give,<br/>You Can Watch.</h2>
            <p style={{marginBottom:'2rem', fontSize:'1rem', color:'rgba(255,255,255,0.6)', lineHeight:1.6}}>See the real story behind this campaign — or go straight to donating. Either way, thank you.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              <button
                onClick={() => { setShowVideoChoice(false); navigate('/raffle'); }}
                style={{width:'100%', borderRadius:'100px', border:'1.5px solid rgba(232,204,116,0.5)', background:'rgba(232,204,116,0.08)', padding:'1.35rem 1.5rem', fontSize:'1.05rem', fontWeight:700, color:'#e8cc74', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.65rem', transition:'background 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.background='rgba(232,204,116,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(232,204,116,0.08)'}
              >
                <PlayCircle size={22} />
                <span>Watch to Enter Raffle of <strong style={{color:'#fff'}}>$1,000</strong></span>
              </button>
              <button
                onClick={() => { setShowVideoChoice(false); onDonateClick(selectedAmount); }}
                style={{width:'100%', borderRadius:'100px', background:'linear-gradient(90deg,#e8cc74,#f0d97a)', padding:'1.35rem', fontSize:'1.05rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#091031', cursor:'pointer', border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.65rem', boxShadow:'0 4px 24px rgba(232,204,116,0.35)'}}
              >
                Donate Now <ArrowRight size={20} />
              </button>
            </div>
            <button onClick={() => setShowVideoChoice(false)} style={{marginTop:'1.5rem', fontSize:'0.875rem', color:'rgba(255,255,255,0.4)', background:'none', border:'none', cursor:'pointer', letterSpacing:'0.5px'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden', paddingBottom:'3rem'}}>
        {/* hero-bg */}
        <div style={{position:'absolute', inset:0, zIndex:0, backgroundImage:"url('/images/1000.png')", backgroundSize:'cover', backgroundPosition:'center top', backgroundRepeat:'no-repeat'}}></div>
        {/* dark overlay (hero-bg::after) */}
        <div style={{position:'absolute', inset:0, zIndex:0, background:'linear-gradient(110deg, rgba(7,15,48,0.95) 0%, rgba(11,26,79,0.82) 55%, rgba(7,15,48,0.92) 100%)'}}></div>
        {/* red radial glow (hero::before) */}
        <div style={{position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 0%, rgba(200,20,30,0.15) 0%, transparent 60%)'}}></div>

        {/* hero-content */}
        <div style={{position:'relative', zIndex:2, maxWidth:'960px', padding:'0 7%', paddingTop:'72px', textAlign:'center', margin:'0 auto', width:'100%'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(242,223,168,0.09)', border:'1px solid rgba(242,223,168,0.27)', color:'#F2DFA8', fontSize:'0.75rem', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', padding:'0.4rem 1.1rem', borderRadius:'100px', marginBottom:'2rem'}}>
            Chasdei Mordechai — Restoring Every Shabbos Table
          </div>

          <h1 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(3.8rem,9.5vw,9rem)', color:'#FFFFFF', lineHeight:0.92, letterSpacing:'2px', fontWeight:700, margin:'0 0 1.8rem 0'}}>
            UH OH.<br />
            THERE IS <span style={{color:'#F2DFA8'}}>NO MILK.</span>
          </h1>

          <p style={{fontFamily:"'Inter',sans-serif", fontSize:'clamp(1rem,1.8vw,1.2rem)', color:'rgba(255,255,255,0.78)', lineHeight:1.85, maxWidth:'510px', margin:'0 auto 2.8rem'}}>
            For you, it's an inconvenience.<br />
            For Chaim, it's a{' '}
            <span style={{color:'#F2DFA8', background:'rgba(200,20,30,0.15)', padding:'0.1em 0.4em', borderRadius:'8px'}}>crisis.</span>
            <br /><br />
            Eight children.<br />
            An empty fridge.<br />
            Shabbos approaching.
          </p>

          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>
            <button
              onClick={() => setShowVideoChoice(true)}
              style={{display:'inline-block', background:'rgba(200,20,30,0.15)', border:'1.5px solid rgba(200,20,30,0.45)', color:'#F2DFA8', fontSize:'0.95rem', fontWeight:900, letterSpacing:'1.5px', textTransform:'uppercase', padding:'1rem 2.5rem', borderRadius:'100px', cursor:'pointer', transition:'all 0.22s ease', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif"}}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(200,20,30,0.28)'; e.currentTarget.style.borderColor='rgba(200,20,30,0.7)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(200,20,30,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(200,20,30,0.15)'; e.currentTarget.style.borderColor='rgba(200,20,30,0.45)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
            >
              THE ANXIETY IS REAL.
            </button>
          </div>
        </div>
      </section>

      {/* ── URGENCY BAR ── */}
      <div style={{background:'rgba(200,20,30,0.15)', border:'1.5px solid rgba(200,20,30,0.45)', borderRadius:'16px', maxWidth:'90%', margin:'1.5rem auto', padding:'1.2rem 3rem', textAlign:'center'}}>
        <p style={{color:'rgba(255,255,255,0.70)', fontSize:'0.88rem', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', fontFamily:"'Inter',sans-serif", margin:0}}>
          <strong style={{color:'#F2DFA8', fontWeight:700}}>Shabbos doesn't wait.</strong> Don't close this page while Chaim's fridge is still empty.
        </p>
      </div>

      {/* ── DONATION SECTION ── */}
      <section style={{background:'#070F30', padding:'7rem 6%'}} id="give">
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>

          <div style={{textAlign:'center', marginBottom:'3.5rem'}}>
            <div style={{display:'inline-block', background:'rgba(200,20,30,0.12)', color:'#F2DFA8', border:'1px solid rgba(200,20,30,0.30)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', padding:'0.4rem 1rem', borderRadius:'100px', marginBottom:'1.5rem', fontFamily:"'Inter',sans-serif"}}>
              Make a Difference
            </div>
            <h2 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'clamp(2.5rem,5vw,4.2rem)', color:'#FFFFFF', lineHeight:1, letterSpacing:'1px', margin:'0 0 1rem 0', fontWeight:700}}>
              YOU CAN <span style={{color:'#F2DFA8'}}>CHANGE THAT.</span>
            </h2>
          </div>

          {/* Tier cards */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'3.5rem'}}>
            {[
              { amount: 12, title: "One Child's Peace", desc: 'A lechtiga Shabbos meal for little Chany.' },
              { amount: 60, title: 'Fill the Fridge', desc: 'Proteins and dairy for the week.', popular: true },
              { amount: 120, title: 'Restore the Whole Table', desc: 'A full Shabbos for a family of eight.' },
            ].map((tier) => {
              const isSel = selectedAmount === tier.amount;
              return (
                <div
                  key={tier.amount}
                  onClick={() => handleSelectAmount(tier.amount)}
                  style={{background: isSel ? 'rgba(242,223,168,0.08)' : 'rgba(255,255,255,0.06)', border: isSel ? '1.5px solid #F2DFA8' : '1.5px solid rgba(255,255,255,0.10)', borderRadius:'22px', padding:'2.5rem 2rem', cursor:'pointer', transition:'all 0.25s ease', position:'relative', boxShadow: isSel ? '0 0 0 3px rgba(242,223,168,0.16), 0 20px 60px rgba(0,0,0,0.28)' : 'none'}}
                  onMouseEnter={e => { if (!isSel) { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='#F2DFA8'; e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.35)'; } }}
                  onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='none'; } }}
                >
                  {tier.popular && (
                    <div style={{position:'absolute', top:'-13px', left:'50%', transform:'translateX(-50%)', background:'#F2DFA8', color:'#0B1A4F', fontSize:'0.68rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:'100px', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif"}}>
                      Most Popular
                    </div>
                  )}
                  <div style={{fontFamily:"'Bebas Neue',cursive", fontSize:'3.8rem', color:'#FFFFFF', lineHeight:1, marginBottom:'0.4rem', fontWeight:400}}>${tier.amount}</div>
                  <div style={{fontWeight:700, color:'#F2DFA8', fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'1rem', fontFamily:"'Inter',sans-serif"}}>{tier.title}</div>
                  <p style={{color:'rgba(255,255,255,0.55)', fontSize:'0.95rem', lineHeight:1.65, margin:0, fontFamily:"'Inter',sans-serif"}}>{tier.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Chaim's copy */}
          <div style={{maxWidth:'680px', margin:'0 auto 3rem', textAlign:'center'}}>
            <p style={{color:'rgba(255,255,255,0.65)', fontSize:'1.05rem', lineHeight:1.85, marginBottom:'0.75rem', fontFamily:"'Inter',sans-serif"}}>
              Chaim's <em>harchavas hadaas</em> hangs by a thread.
            </p>
            <p style={{color:'rgba(255,255,255,0.65)', fontSize:'1.05rem', lineHeight:1.85, margin:0, fontFamily:"'Inter',sans-serif"}}>
              Your generosity doesn't just put food on a table. It restores <em>kavod Shabbos</em>. It transforms their week.
            </p>
          </div>

          {/* Donate box */}
          <div ref={donateSectionRef} style={{background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.14)', borderRadius:'26px', padding:'2.5rem 3rem', maxWidth:'660px', margin:'0 auto', textAlign:'center', backdropFilter:'blur(10px)'}}>
            <h3 style={{fontFamily:"'Bebas Neue',cursive", fontSize:'2.2rem', color:'#FFFFFF', letterSpacing:'1px', marginBottom:'1.5rem', fontWeight:700}}>
              YES. I WILL BE THE ANSWER.
            </h3>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={handleCustomAmountChange}
              style={{width:'100%', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.15)', borderRadius:'100px', color:'#FFFFFF', fontSize:'1.05rem', fontFamily:"'Inter',sans-serif", fontWeight:600, padding:'0.9rem 1.5rem', marginBottom:'1.25rem', outline:'none', textAlign:'center', transition:'border-color 0.2s', display:'block'}}
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
            <p style={{color:'rgba(255,255,255,0.28)', fontSize:'0.78rem', marginTop:'1rem', fontFamily:"'Inter',sans-serif"}}>🔒 Secure &amp; encrypted · Tax-deductible</p>
          </div>

        </div>
      </section>

      {/* ── PHOTO STRIP ── */}
      <section style={{padding:'7rem 6%', background:'#0B1A4F'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div style={{borderRadius:'22px', overflow:'hidden', maxWidth:'650px', margin:'0 auto'}}>
            <img src="/images/home-last.png" alt="Happy family at Shabbos table" style={{width:'100%', height:'auto', borderRadius:'18px', display:'block'}} loading="lazy" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

