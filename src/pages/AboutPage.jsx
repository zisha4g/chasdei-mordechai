
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { useRaffle } from '@/contexts/RaffleContext';

const AboutPage = ({ onDonateClick }) => {
  const { openRaffle } = useRaffle();

  return (
    <div className="bg-white pb-20 pt-24">
      <Helmet>
        <title>About Us | Chasdei Mordechai</title>
        <meta
          name="description"
          content="Learn about our mission to restore dignity to families in our community facing hidden crises."
        />
      </Helmet>

      {/* Section 1: Mission */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
            Let's be real.<br />
            <span className="text-primary">It Was Never 'About Us.'</span><br />
            It's About Our Family.
          </h1>
          <div className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mb-12">
            Chasdei Mordechai isn't just an organization. It's a lifeline for your cousin, your neighbor, your friend. We don't see "cases." We see the people sitting next to us in shul.
          </p>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto h-[400px]">
            <img 
              src="/images/1002.png" 
              alt="Family at Shabbos table" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Section 2: The Hidden Reality */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">The Hidden Reality in Our Own Community</h2>
              <p className="text-lg text-gray-600">
                The struggle is closer than we like to think. Within our circles, many families are quietly fighting the pain of infertility. Others are reeling from life-altering medical diagnoses.
              </p>
              <p className="text-lg text-gray-600">
                And far too many are struggling just to make ends meet. This isn't "out there." It's right here.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-primary relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10"></div>
              <blockquote className="text-xl font-medium text-gray-800 italic leading-relaxed relative z-10">
                "We don't judge. We don't ask unnecessary questions that strip away pride. We see a void, and we fill it. Because that's what family does."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">Tefillah for All.<br/>Action for Those We Can Help.</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We believe in the power of tefillah for every soul in pain. But when our extended family cannot afford bread, rent, or basic groceries — Hashem has also given us the tools to help them in a tangible way. We don't just feel the pain. Together, we relieve it.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => {
                document.getElementById('video-section').scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gray-900 hover:bg-black text-white px-8 py-6 text-lg"
            >
              SEE THE IMPACT
            </Button>
            <Button 
              onClick={() => onDonateClick(60)}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
            >
              DONATE NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: Video / Story */}
      <section id="video-section" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Video Placeholder */}
          <div 
            onClick={openRaffle}
            className="relative w-full aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-16 border border-gray-700 group cursor-pointer"
          >
            <img 
              src="/images/1002.png" 
              alt="Children enjoying Shabbos meal"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <PlayCircle className="w-20 h-20 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
              <span className="mt-4 text-sm font-medium tracking-widest text-white/90 uppercase drop-shadow-md">Watch Mendy's Story & Enter Raffle</span>
            </div>
          </div>

          {/* Script Text */}
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-300 font-serif leading-relaxed">
            <p>
              <span className="text-3xl text-white font-bold float-left mr-2 mt-[-6px]">"A</span> good friend of mine, Mendy, came to me on a Tuesday. He's a guy who always volunteers for everything. Always smiling."
            </p>
            <p>
              "He pulled me aside and he was shaking. He said, 'Yossi, I don't know what to do. My wife was in the hospital for two weeks. I missed work. I just looked in my bank account and... there's nothing. Shabbos is in three days. I have nothing to give my kids.'"
            </p>
            <p>
              "The heartbreak in his eyes... I'll never forget it. A father who feels like he failed. We couldn't let that stand."
            </p>
            <p>
              "Within 24 hours, Chasdei Mordechai delivered a discreet package to his door. Groceries. Meat. Chicken. Challah. And a small envelope to cover his immediate bills. We didn't make a big deal out of it. We didn't make him feel like a charity case."
            </p>
            <p className="text-white font-medium text-xl mt-8">
              "We just reminded him he wasn't alone. That's what we do. We don't just feed people. We restore homes, tables, and hearts."
            </p>
          </div>

          <div className="text-center mt-16 space-y-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto h-[350px]">
              <img 
                src="/images/1002.png" 
                alt="Joy and togetherness" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            </div>
            
            <Button 
              onClick={() => onDonateClick(120)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold px-12 py-8 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-105 transition-all"
            >
              YES, I WILL HELP
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
