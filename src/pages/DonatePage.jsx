
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight, Heart } from 'lucide-react';

const DonatePage = ({ onDonateClick }) => {
  return (
    <div className="site-page pb-20 pt-20">
      <Helmet>
        <title>Donate | Chasdei Mordechai</title>
        <meta
          name="description"
          content="Make a secure donation to Chasdei Mordechai. Feed a family in crisis."
        />
      </Helmet>

      <section className="border-b border-white/10 bg-[#101a4d]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="flex items-center justify-center bg-[#0c143f] py-8 px-6">
            <img
              src="/images/1012.png"
              alt="Children by empty fridge"
              className="max-h-[500px] w-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center px-10 py-16 bg-[#101a4d]">
            <span className="site-eyebrow px-5 py-1.5">Make a Difference</span>
            <h1 className="font-display mt-8 text-5xl md:text-6xl lg:text-7xl font-semibold uppercase text-white mb-6 leading-[0.92]">
              Shabbos Is Coming.<br />
              <span className="text-[#efd37a]">Her Fridge Is Empty.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/88 mb-10 max-w-lg leading-relaxed font-medium">
              Hashem placed this moment in your hands.<br />
              You are the power to say <strong className="text-white">YES.</strong>
            </p>
            <Button
              onClick={() => onDonateClick(60)}
              className="rounded-full bg-[#e8cc74] px-14 py-7 text-xl font-extrabold uppercase tracking-[0.12em] text-[#091031] shadow-xl transition-transform hover:scale-105 hover:bg-[#f1d989]"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0b123a]">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <Heart className="mx-auto text-[#efd37a] mb-4" size={40} />
          <p className="text-2xl text-white font-medium leading-relaxed">
            A mother stands before an empty fridge, calculating how to make Shabbos this week. She hides her panic with a smile.
          </p>
          <p className="text-lg text-white/88 leading-relaxed">
            Even as her children ask, "Is there more chicken?" or "Can I have more sweet potato?" — she has no answer. This isn't far away. It's happening right here, in our community.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/8 bg-[#101a4d]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-semibold uppercase text-white mb-4">This Is Where You Step In.</h2>
            <p className="text-white/88">Hundreds of donors have already said, "I won't let a family face Shabbos like this."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 */}
            <div 
              onClick={() => onDonateClick(120)}
              className="site-shell rounded-[1.8rem] overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://horizons-cdn.hostinger.com/1084070f-ea28-4c68-a5d2-91589f967163/bdac3a76366932238b44ef48a7ab23ae.png" 
                  alt="Family at Shabbos table with traditional foods" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="font-display text-4xl font-semibold">$120</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors">Feed an Entire Family</h3>
                <p className="text-white/88 mb-6 flex-grow">A full Shabbos table. Fish. Chicken. Kugel. Everything.</p>
                <div className="text-[#efd37a] font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2 (Popular) */}
            <div 
              onClick={() => onDonateClick(60)}
              className="rounded-[1.8rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(23,37,84,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full relative border border-[#e8cc74] bg-[rgba(255,255,255,0.08)]"
            >
              <div className="absolute top-4 right-4 z-10 bg-[#e8cc74] text-[#091031] px-3 py-1 rounded-full text-xs font-bold shadow-md">POPULAR</div>
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://horizons-cdn.hostinger.com/1084070f-ea28-4c68-a5d2-91589f967163/6b669c963b859e9851d69c5b09bd35a4.png" 
                  alt="Children sharing food and joy" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091031] via-[#091031]/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="font-display text-5xl font-semibold drop-shadow-md">$60</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white">Fill the Fridge</h3>
                <p className="text-primary-foreground/90 mb-6 flex-grow">The essentials that turn a week of panic into peace.</p>
                <div className="text-[#efd37a] font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => onDonateClick(12)}
              className="site-shell rounded-[1.8rem] overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full hover:-translate-y-2"
            >
              <div className="h-48 bg-[rgba(255,255,255,0.03)] relative flex items-center justify-center border-b border-white/10">
                <Heart className="text-[#efd37a]/30 w-24 h-24 absolute opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <span className="font-display text-5xl font-semibold text-[#efd37a] relative z-10">$12</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors">One Child's Shabbos</h3>
                <p className="text-white/88 mb-6 flex-grow">Ensure one child feels the full joy of the day.</p>
                <div className="text-[#efd37a] font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-6">
            <Button 
              onClick={() => onDonateClick(60)}
              className="w-full rounded-full bg-[#e8cc74] py-8 text-xl font-extrabold uppercase tracking-[0.14em] text-[#091031] shadow-xl hover:bg-[#f1d989]"
            >
              YES. I WILL BE THE ANSWER.
            </Button>
            <div className="flex items-center justify-center space-x-4 text-sm text-white/42">
              <span className="flex items-center"><Shield className="w-4 h-4 mr-1 text-green-500" /> Secure Processing</span>
              <span className="flex items-center"><Lock className="w-4 h-4 mr-1 text-white/36" /> 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b123a] border-t border-white/8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/images/1011.png"
                alt="Children eating potato chips"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="text-center lg:text-left space-y-6">
              <div className="w-24 h-1 bg-[#efd37a] rounded-full mx-auto lg:mx-0"></div>
              <h2 className="font-display text-4xl font-semibold uppercase text-white">It takes less than a minute.</h2>
              <p className="text-lg text-white/88">
                But for this mother, it changes the entire week. <span className="font-bold text-white">You are the answer she's been waiting for.</span>
              </p>
              <Button
                onClick={() => onDonateClick(60)}
                className="rounded-full bg-[#e8cc74] px-8 py-6 text-lg font-extrabold uppercase tracking-[0.12em] text-[#091031] shadow-xl hover:bg-[#f1d989]"
              >
                YES. I WILL BE THE ANSWER.
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
