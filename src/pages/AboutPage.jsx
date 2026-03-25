
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const realityPoints = [
    { text: 'Many families are quietly fighting the pain of infertility.' },
    { text: 'Others are reeling from life-altering medical diagnoses.' },
    { text: 'And far too many are struggling just to make ends meet.' },
  ];

  return (
    <div style={{ background: '#0B1A4F', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 640px) {
          .struggle-grid {
            grid-template-columns: 1fr !important;
          }
          .struggle-text {
            text-align: center;
          }
          .struggle-text .reality-point {
            justify-content: center;
          }
          .struggle-text .blockquote-bar {
            text-align: left;
          }
        }
      `}</style>
      <Helmet>
        <title>About Us | Chasdei Mordechai</title>
        <meta name="description" content="Learn about our mission to restore dignity to families in our community facing hidden crises." />
      </Helmet>

      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingBottom: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: "url('/images/1002.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(110deg, rgba(7,15,48,0.95) 0%, rgba(11,26,79,0.82) 55%, rgba(7,15,48,0.92) 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 0%, rgba(200,20,30,0.15) 0%, transparent 60%)' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', padding: '0 7%', paddingTop: '72px', textAlign: 'center', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(242,223,168,0.09)', border: '1px solid rgba(242,223,168,0.27)', color: '#F2DFA8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '0.4rem 1.1rem', borderRadius: '100px', marginBottom: '2rem', fontFamily: "'Inter',sans-serif" }}>
            Who We Are
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(3.8rem,9.5vw,9rem)', color: '#FFFFFF', lineHeight: 0.92, letterSpacing: '2px', fontWeight: 700, margin: '0 0 1.8rem 0' }}>
            LET'S BE REAL.<br />IT WAS NEVER<br />
            <span style={{ color: '#F2DFA8' }}>&quot;ABOUT US.&quot;</span>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, maxWidth: '510px', margin: '0 auto 2.8rem' }}>
            It's about our family.<br /><br />
            <strong style={{ color: '#fff' }}>Chasdei Mordechai isn't just an organization.</strong><br />
            It's a lifeline for your cousin, your neighbor, your friend.
          </p>

        </div>
      </section>

      <section style={{ padding: '4rem 6%', background: '#0B1A4F' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(200,20,30,0.12)', color: '#F2DFA8', border: '1px solid rgba(200,20,30,0.30)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '1.5rem', fontFamily: "'Inter',sans-serif" }}>
              Our Philosophy
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(2.5rem,5vw,4.2rem)', color: '#FFFFFF', lineHeight: 1, letterSpacing: '1px', fontWeight: 700, margin: '0 0 1.5rem 0' }}>
              WE DON'T SEE <span style={{ color: '#F2DFA8' }}>&quot;CASES.&quot;</span><br />WE SEE PEOPLE.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, fontFamily: "'Inter',sans-serif" }}>
              We see the people sitting next to us in shul.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 6%', background: '#070F30' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="struggle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="struggle-text">
              <div style={{ display: 'inline-block', background: 'rgba(200,20,30,0.12)', color: '#F2DFA8', border: '1px solid rgba(200,20,30,0.30)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '1.5rem', fontFamily: "'Inter',sans-serif" }}>
                The Hidden Reality
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(2.5rem,5vw,4.2rem)', color: '#FFFFFF', lineHeight: 1, letterSpacing: '1px', fontWeight: 700, margin: '0 0 1.5rem 0' }}>
                THE STRUGGLE IS <span style={{ color: '#F2DFA8' }}>CLOSER</span> THAN WE THINK.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginBottom: '1.25rem', fontFamily: "'Inter',sans-serif" }}>
                Within our circles:
              </p>
              {realityPoints.map((pt, i) => (
                <div className="reality-point" key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(200,20,30,0.5)', boxShadow: '0 0 8px rgba(200,20,30,0.35)', marginTop: '0.5rem', flexShrink: 0 }}></div>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, fontFamily: "'Inter',sans-serif" }}>
                    {pt.text}
                  </p>
                </div>
              ))}
              <div className="blockquote-bar" style={{ margin: '2rem 0 0', padding: '1.5rem 2rem', borderLeft: '4px solid rgba(200,20,30,0.5)', background: 'rgba(200,20,30,0.07)', borderRadius: '0 14px 14px 0' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#F2DFA8', fontWeight: 600, margin: 0, lineHeight: 1.7, fontFamily: "'Inter',sans-serif" }}>
                  &quot;This isn't 'out there.' It's right here.&quot;
                </p>
              </div>
            </div>

            <div style={{ borderRadius: '22px', overflow: 'hidden', height: '480px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
              <img src="/images/about-struggle.png" alt="Community scenes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(to top, rgba(7,15,48,0.92) 0%, transparent 100%)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#F2DFA8', marginBottom: '0.4rem', fontFamily: "'Inter',sans-serif" }}>Our Community</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.9rem', color: '#FFFFFF', letterSpacing: '1px', fontWeight: 700 }}>Right Here, Right Now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 6%', background: '#0B1A4F' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(200,20,30,0.12)', color: '#F2DFA8', border: '1px solid rgba(200,20,30,0.30)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '1.5rem', fontFamily: "'Inter',sans-serif" }}>
              Our Approach
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(2.5rem,5vw,4.2rem)', color: '#FFFFFF', lineHeight: 1, letterSpacing: '1px', fontWeight: 700, margin: '0 0 1.5rem 0' }}>
              TEFILLAH FOR ALL.<br /><span style={{ color: '#F2DFA8' }}>ACTION</span> FOR THOSE WE CAN HELP.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginBottom: '1.2rem', fontFamily: "'Inter',sans-serif" }}>
              We believe in the power of tefillah for every soul in pain. But when our extended family cannot afford bread, rent, or basic groceries, <strong style={{ color: '#fff' }}>Hashem has also given us the tools to help them in a tangible way.</strong>
            </p>
            <div style={{ width: '56px', height: '3px', background: 'rgba(200,20,30,0.5)', borderRadius: '100px', margin: '2rem auto' }}></div>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginBottom: '2rem', fontFamily: "'Inter',sans-serif" }}>
              We don't just feel the pain. <strong style={{ color: '#fff' }}>Together, we relieve it.</strong>
            </p>
            <button
              onClick={() => navigate('/raffle')}
              style={{ display: 'inline-block', background: 'rgba(242,223,168,0.09)', color: '#F2DFA8', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '1.5px', padding: '1rem 2.2rem', borderRadius: '100px', border: '1.5px solid rgba(242,223,168,0.5)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,223,168,0.18)'; e.currentTarget.style.borderColor = '#F2DFA8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,223,168,0.09)'; e.currentTarget.style.borderColor = 'rgba(242,223,168,0.5)'; e.currentTarget.style.transform = ''; }}
            >
              See the Impact →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
