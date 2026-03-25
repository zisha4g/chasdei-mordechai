import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get('name') || 'FRIEND';
  const amount = params.get('amount');

  return (
    <div className="site-page min-h-screen py-12 pt-24">
      <Helmet>
        <title>Thank You | Chasdei Mordechai</title>
        <meta name="description" content="Thank you for supporting Chasdei Mordechai." />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101a4d] text-white shadow-2xl">
          <div className="p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e8cc74]/50 bg-[#e8cc74]/10 text-3xl text-[#efd37a]">✓</div>
            <h1 className="font-display text-5xl font-semibold uppercase leading-tight md:text-7xl">You Did It,<br /><span className="text-[#efd37a]" dir="auto">{name.toUpperCase()}</span>!</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">You just replaced a father's nightmare with a table full of food and a heart full of hope.</p>
            {amount ? <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/45">Official Receipt · Gift of ${amount}</p> : null}
          </div>

          <div className="border-t border-white/10 p-8">
            <h2 className="mb-4 text-2xl font-bold uppercase text-white">What You Just Did For Chaim</h2>
            <p className="mb-4 text-white/80">Because of your kindness, Chaim can put his worries aside and sing Zemiros with his children in true simcha.</p>
            <p className="mb-4 text-white/80">When Chaim lost his job, he lost more than a paycheck. He lost the pride of being a provider.</p>
            <p className="text-white"><strong className="text-[#efd37a]">But today, you gave it back to him.</strong></p>
          </div>

          <div className="border-t border-white/10 p-8">
            <h3 className="mb-3 text-xl font-bold text-white">Join the Family</h3>
            <p className="mb-5 text-white/70">Don't let the connection end here. Receive monthly family updates and see exactly how your generosity continues to restore homes, tables, and hearts.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/" className="rounded-full bg-[#e8cc74] px-6 py-3 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#091031]">Return Home</a>
              <Link to="/raffle" className="rounded-full border border-[#e8cc74]/40 px-6 py-3 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#efd37a]">Enter Raffle</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;