
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onDonateClick }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(60);

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

  return (
    <div className="site-page pb-20">
      <Helmet>
        <title>Chasdei Mordechai | Restoring Dignity</title>
        <meta
          name="description"
          content="When Shabbos approaches and the fridge is empty, your gift restores peace, dignity, and a full table."
        />
      </Helmet>

      <section className="relative flex min-h-[calc(100vh-1rem)] items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0b123a',
            backgroundImage: 'url(/images/1000.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 28%',
          }}
        >
          <div className="absolute inset-0" style={{background: 'rgba(10,18,57,0.38)'}}></div>
          <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, transparent 30%, rgba(9,16,49,0.55) 100%)'}}></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <span className="site-eyebrow px-5 py-1.5">
            Chasdei Mordechai - Restoring Every Shabbos Table
          </span>
          <h1
            className="font-display mt-8 text-[4.6rem] font-semibold uppercase leading-[0.86] tracking-[-0.02em] text-white sm:text-[6.8rem] lg:text-[8.6rem]"
          >
            UH OH.<br />
            THERE IS NO <span className="text-[#efd37a]">MILK.</span>
          </h1>
          <div className="mt-8 space-y-3 text-center text-[1.1rem] font-medium leading-9 text-white sm:text-[1.4rem]">
            <p>
              For you, it's an inconvenience.<br className="hidden sm:block" />
              For Chaim, it's a <span className="text-[#efd37a]">crisis.</span>
            </p>
            <p className="pt-3 text-white/90">Eight children.</p>
            <p className="text-white/90">An empty fridge.</p>
            <p className="text-white/90">Shabbos approaching.</p>
          </div>
          <Button
            onClick={() => onDonateClick(selectedAmount)}
            className="mt-10 rounded-full border border-[#a93d58] bg-[rgba(93,39,89,0.36)] px-10 py-7 font-extrabold uppercase tracking-[0.12em] text-[#efd37a] hover:bg-[rgba(126,49,107,0.42)]"
          >
            The Anxiety Is Real.
          </Button>
          <button
            onClick={() => navigate('/raffle')}
            className="mt-5 text-sm font-semibold text-white/62 underline-offset-4 transition hover:text-white"
          >
            Watch and enter the raffle
          </button>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#15225f] px-4 py-5 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#7d2b46] bg-[rgba(60,32,79,0.44)] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#efd37a] sm:text-base">
          Shabbos Doesn't Wait. Don't Close This Page While Chaim's Fridge Is Still Empty.
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="site-eyebrow px-5 py-1.5">Make a Difference</span>
            <h2 className="font-display mt-6 text-5xl font-semibold uppercase tracking-[-0.02em] text-white sm:text-7xl">
              You Can <span className="text-[#efd37a]">Change That.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {options.map((option) => {
              const isSelected = selectedAmount === option.amount;
              return (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => setSelectedAmount(option.amount)}
                  className={`relative rounded-[1.7rem] border px-6 py-8 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-[#e8cc74] bg-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(3,8,30,0.35)]'
                      : 'border-white/10 bg-[rgba(255,255,255,0.05)] hover:border-white/20 hover:bg-[rgba(255,255,255,0.07)]'
                  }`}
                >
                  {option.featured && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#efd37a] px-4 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#091031]">
                      Most Popular
                    </span>
                  )}
                  <div className="font-display text-[3.2rem] font-semibold leading-none text-white">${option.amount}</div>
                  <div className="mt-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#efd37a]">{option.title}</div>
                  <p className="mt-4 text-base leading-7 text-white/62">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-14 max-w-3xl text-center text-xl leading-10 text-white/82">
            <p>Chaim's <em>harchavas hadaas</em> hangs by a thread.</p>
            <p className="mt-3 text-lg leading-9 text-white/88">
              Your generosity doesn't just put food on a table. It restores <em>kavod Shabbos</em>. It transforms their week.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-8 py-10 text-center shadow-[0_24px_70px_rgba(3,8,30,0.34)]">
            <h3 className="font-display text-[3rem] font-semibold uppercase leading-none text-white sm:text-[3.8rem]">
              Yes. I Will Be The Answer.
            </h3>
            <div className="mt-8 rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-6 py-4 text-2xl font-bold text-white/90">
              {selectedAmount}
            </div>
            <Button
              onClick={() => onDonateClick(selectedAmount)}
              className="mt-5 h-auto w-full rounded-full bg-[#e8cc74] px-8 py-6 text-lg font-extrabold uppercase tracking-[0.14em] text-[#091031] hover:bg-[#f1d989]"
            >
              Donate Now <ArrowRight className="ml-2" size={18} />
            </Button>
            <p className="mt-6 text-sm text-white/28">Secure & encrypted - Tax-deductible</p>
          </div>
        </div>
      </section>

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
