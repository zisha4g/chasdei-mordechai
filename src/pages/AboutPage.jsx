
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const AboutPage = ({ onDonateClick }) => {
  const { settings } = useSiteSettings();

  return (
    <div className="site-page pb-20 pt-24">
      <Helmet>
        <title>About Us | Chasdei Mordechai</title>
        <meta
          name="description"
          content="Learn about our mission to restore dignity to families in our community facing hidden crises."
        />
      </Helmet>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="site-eyebrow px-5 py-1.5">Who We Are</span>
          <h1 className="font-display mt-8 text-5xl md:text-7xl font-semibold uppercase text-white mb-8 leading-[0.92] tracking-tight">
            Let's be real.<br />
            <span className="text-[#efd37a]">It Was Never 'About Us.'</span><br />
            It's About Our Family.
          </h1>
          <div className="w-24 h-1.5 bg-[#efd37a] mx-auto rounded-full mb-8"></div>
          <p className="text-xl md:text-2xl text-white/88 leading-relaxed font-light mb-12">
            Chasdei Mordechai isn't just an organization. It's a lifeline for your cousin, your neighbor, your friend. We don't see "cases." We see the people sitting next to us in shul.
          </p>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl max-w-3xl mx-auto h-[400px] border border-white/10">
            <img 
              src="/images/1002.png" 
              alt="Family at Shabbos table" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091031]/65 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-white/8 bg-[#101a4d]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-4xl font-semibold uppercase text-white">The Hidden Reality in Our Own Community</h2>
              <p className="text-lg text-white/88">
                The struggle is closer than we like to think. Within our circles, many families are quietly fighting the pain of infertility. Others are reeling from life-altering medical diagnoses.
              </p>
              <p className="text-lg text-white/88">
                And far too many are struggling just to make ends meet. This isn't "out there." It's right here.
              </p>
            </div>
            <div className="site-shell p-8 rounded-[2rem] relative overflow-hidden">
              <blockquote className="text-xl font-medium text-white italic leading-relaxed relative z-10">
                "We don't judge. We don't ask unnecessary questions that strip away pride. We see a void, and we fill it. Because that's what family does."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b123a]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="font-display text-5xl font-semibold uppercase text-white">Tefillah for All.<br/>Action for Those We Can Help.</h2>
          <p className="text-xl text-white/88 max-w-2xl mx-auto">
            We believe in the power of tefillah for every soul in pain. But when our extended family cannot afford bread, rent, or basic groceries — Hashem has also given us the tools to help them in a tangible way. We don't just feel the pain. Together, we relieve it.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => {
                document.getElementById('video-section').scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full border border-white/12 bg-white/5 px-8 py-6 text-lg font-bold text-white hover:bg-white/10"
            >
              SEE THE IMPACT
            </Button>
            <Button 
              onClick={() => onDonateClick(60)}
              className="rounded-full bg-[#e8cc74] px-8 py-6 text-lg font-extrabold text-[#091031] hover:bg-[#f1d989]"
            >
              DONATE NOW
            </Button>
          </div>
        </div>
      </section>

      <section id="video-section" className="py-24 border-t border-white/8 bg-[#101a4d] text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl mb-16 border border-white/10 bg-black/30">
            <iframe
              src={settings.videoEmbedUrl}
              title="Watch Mendy's Story"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-white/88 font-serif leading-relaxed">
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
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl max-w-2xl mx-auto h-[350px] border border-white/10">
              <img 
                src="/images/1002.png" 
                alt="Joy and togetherness" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091031]/55 to-transparent"></div>
            </div>
            
            <Button 
              onClick={() => onDonateClick(120)}
              className="rounded-full bg-[#e8cc74] px-12 py-8 text-xl font-extrabold text-[#091031] shadow-[0_0_30px_rgba(232,204,116,0.18)] hover:scale-105 hover:bg-[#f1d989] transition-all"
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
