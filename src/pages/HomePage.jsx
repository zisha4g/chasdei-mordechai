
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onDonateClick }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(60);
  const [customAmount, setCustomAmount] = useState(60);
  const [showVideoChoice, setShowVideoChoice] = useState(false);
  const donateSectionRef = useRef(null);

  const options = [
    {
      amount: 12,
      title: "One Child's Peace",
      description: 'A lechtiga Shabbos meal for little Chany.',
    },
    {
      amount: 60,
      title: 'Fill the Fridge',
      description: 'Proteins and dairy for the week.',
      featured: true,
    },
    {
      amount: 120,
      title: 'Restore the Whole Table',
      description: 'A full Shabbos for a family of eight.',
    },
  ];

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
    <div className="site-page pb-20">
      <Helmet>
        <title>Chasdei Mordechai | Restoring Dignity</title>
        <meta
          name="description"
          content="When Shabbos approaches and the fridge is empty, your gift restores peace, dignity, and a full table."
        />
      </Helmet>

      {/* Video / Donate choice modal */}
      {showVideoChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#101a4d] p-8 text-center shadow-2xl">
            <p className="mb-6 text-lg font-semibold text-white">What would you like to do?</p>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => { setShowVideoChoice(false); navigate('/raffle'); }}
                className="w-full rounded-full border border-white/15 bg-white/5 py-5 text-base font-bold text-white hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <PlayCircle size={20} /> Watch the Video First
              </Button>
              <Button
                onClick={() => { setShowVideoChoice(false); onDonateClick(selectedAmount); }}
                className="w-full rounded-full bg-[#e8cc74] py-5 text-base font-extrabold uppercase tracking-[0.08em] text-[#091031] hover:bg-[#f1d989]"
              >
                Donate Now <ArrowRight className="ml-1" size={18} />
              </Button>
            </div>
            <button
              onClick={() => setShowVideoChoice(false)}
              className="mt-5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative flex h-[100dvh] items-center justify-center overflow-hidden px-4">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0b123a',
            backgroundImage: 'url(/images/1000.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 28%',
          }}
        >
          <div className="absolute inset-0" style={{background: 'rgba(10,18,57,0.72)'}}></div>
          <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, transparent 20%, rgba(9,16,49,0.75) 100%)'}}></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <span className="site-eyebrow px-5 py-1.5 text-xs">
            Chasdei Mordechai - Restoring Every Shabbos Table
          </span>
          <h1 className="font-display mt-4 font-semibold uppercase leading-[0.86] tracking-[-0.02em] text-white" style={{fontSize: 'clamp(4.5rem, 11.5vw, 9.5rem)'}}>
            UH OH.<br />
            THERE IS NO<br />
            <span className="text-[#efd37a]">MILK.</span>
          </h1>
          <div className="mt-5 space-y-1.5 text-center font-medium text-white" style={{fontSize: 'clamp(1rem, 1.5vw, 1.35rem)', lineHeight: '2'}}>
            <p>
              For you, it's an inconvenience.<br />
              For Chaim, it's a{' '}
              <span className="relative inline-block font-display font-bold uppercase tracking-wide mx-2 px-3 py-0.5" style={{fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', textShadow: '0 2px 12px rgba(220,0,0,0.7)'}}>
                  <span className="absolute inset-0 rounded bg-red-600 -skew-x-6 shadow-lg" style={{zIndex:0, boxShadow:'0 4px 18px rgba(200,0,0,0.55)'}}></span>
                  <span className="relative text-white" style={{zIndex:1}}>CRISIS.</span>
                </span>
            </p>
            <p className="text-white/90">Eight children.</p>
            <p className="text-white/90">An empty fridge.</p>
            <p className="text-white/90">Shabbos approaching.</p>
          </div>
          <Button
            onClick={() => setShowVideoChoice(true)}
            className="mt-5 rounded-full border border-[#a93d58] bg-[rgba(93,39,89,0.36)] px-10 py-5 font-extrabold uppercase tracking-[0.12em] text-[#efd37a] hover:bg-[rgba(126,49,107,0.42)]"
          >
            The Anxiety Is Real.
          </Button>
        </div>
      </section>

      {/* SHABBOS DOESN'T WAIT BANNER */}
      <section className="border-y border-white/4 bg-[#0b123a] px-4 py-5 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#7d2b46] bg-[rgba(60,32,79,0.44)] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#efd37a] sm:text-base">
          Shabbos Doesn't Wait.{' '}
          <span className="text-white/90">Don't Close This Page While Chaim's Fridge Is Still Empty.</span>
        </div>
      </section>

      {/* DONATION SECTION */}
      <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <span className="site-eyebrow px-5 py-1.5">Make a Difference</span>
            <h2 className="font-display mt-6 text-4xl font-semibold uppercase tracking-[-0.02em] text-white sm:text-7xl">
              You Can <span className="text-[#efd37a]">Change That.</span>
            </h2>
          </div>

          {/* Amount cards */}
          <div className="mx-auto grid max-w-5xl gap-4 grid-cols-3 sm:gap-6">
            {options.map((option) => {
              const isSelected = selectedAmount === option.amount;
              return (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => handleSelectAmount(option.amount)}
                  className={`relative rounded-[1.4rem] border px-3 py-5 text-left transition-all duration-200 active:scale-95 sm:rounded-[1.7rem] sm:px-6 sm:py-8 ${
                    isSelected
                      ? 'border-[#e8cc74] bg-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(3,8,30,0.35)]'
                      : 'border-white/10 bg-[rgba(255,255,255,0.05)] hover:border-white/20 hover:bg-[rgba(255,255,255,0.07)]'
                  }`}
                >
                  {option.featured && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#efd37a] px-3 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-[#091031] sm:px-4 sm:text-[0.68rem]">
                      Popular
                    </span>
                  )}
                  <div className="font-display text-[2rem] font-semibold leading-none text-white sm:text-[3.2rem]">${option.amount}</div>
                  <div className="mt-2 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-[#efd37a] sm:mt-3 sm:text-sm sm:tracking-[0.12em]">{option.title}</div>
                  <p className="mt-2 hidden text-sm leading-6 text-white/70 sm:mt-4 sm:block sm:text-base sm:leading-7">{option.description}</p>
                </button>
              );
            })}
          </div>

          {/* Quote */}
          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
            <p className="text-lg font-bold text-white sm:text-xl">Chaim's <em>harchavas hadaas</em> hangs by a thread.</p>
            <p className="mt-3 text-base leading-8 text-[#efd37a] font-semibold sm:text-lg sm:leading-9">
              Your generosity doesn't just put food on a table. It restores <em>kavod Shabbos</em>. It transforms their week.
            </p>
          </div>

          {/* Donate Now CTA */}
          <div ref={donateSectionRef} className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-6 py-8 text-center shadow-[0_24px_70px_rgba(3,8,30,0.34)] sm:mt-12 sm:px-8 sm:py-10">
            <h3 className="font-display text-[2.4rem] font-semibold uppercase leading-none text-white sm:text-[3.8rem]">
              Yes. I Will Be The Answer.
            </h3>
            <div className="relative mx-auto mt-6 max-w-xs sm:mt-8">
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-white/60">$</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full rounded-full border border-white/20 bg-[rgba(255,255,255,0.06)] py-4 pl-10 pr-6 text-center text-2xl font-bold text-white transition-colors focus:border-[#e8cc74] focus:outline-none focus:ring-2 focus:ring-[#e8cc74]/30"
              />
            </div>
            <Button
              onClick={() => onDonateClick(selectedAmount)}
              className="mt-5 h-auto w-full rounded-full bg-[#e8cc74] px-8 py-6 text-lg font-extrabold uppercase tracking-[0.14em] text-[#091031] hover:bg-[#f1d989]"
            >
              Donate Now <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* CLOSING IMAGE */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#162460] p-8">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.7rem] shadow-[0_20px_70px_rgba(3,8,30,0.35)]">
            <img
              src="/images/1004.png"
              alt="Happy family at Shabbos table with candles and challah"
              className="h-[640px] w-full object-cover object-center"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
