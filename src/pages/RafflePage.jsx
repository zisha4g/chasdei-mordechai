
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Gift, ArrowRight, Lock, X } from 'lucide-react';
import { useRaffle } from '@/contexts/RaffleContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// Fraction of video that must be watched before raffle unlocks (0.5 = 50%)
const WATCH_THRESHOLD = 0.5;

const RafflePage = ({ onDonateClick }) => {
  const { openRaffle } = useRaffle();
  const { settings } = useSiteSettings();
  const iframeRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDonatePrompt, setShowDonatePrompt] = useState(false);
  const isTrackableVimeo = Boolean(settings.vimeoId);

  useEffect(() => {
    if (!settings.videoEmbedUrl) return;

    console.info('Raffle video source', {
      provider: settings.videoProvider,
      videoUrl: settings.videoUrl,
      embedUrl: settings.videoEmbedUrl,
    });
  }, [settings.videoEmbedUrl, settings.videoProvider, settings.videoUrl]);

  useEffect(() => {
    if (!isTrackableVimeo) {
      setUnlocked(true);
      setProgress(1);
      return;
    }

    setUnlocked(false);
    setProgress(0);

    // Load Vimeo Player API script dynamically
    const existing = document.getElementById('vimeo-player-api');
    const init = () => {
      if (!iframeRef.current || !window.Vimeo) return;
      const player = new window.Vimeo.Player(iframeRef.current);
      player.on('timeupdate', (data) => {
        setProgress(data.percent);
        if (data.percent >= WATCH_THRESHOLD) setUnlocked(true);
      });
      player.on('ended', () => {
        setUnlocked(true);
        setShowDonatePrompt(true);
      });
    };
    if (existing) { init(); return; }
    const script = document.createElement('script');
    script.id = 'vimeo-player-api';
    script.src = 'https://player.vimeo.com/api/player.js';
    script.onload = init;
    document.body.appendChild(script);
  }, [isTrackableVimeo, settings.vimeoId]);

  const handleDonate = () => {
    setShowDonatePrompt(false);
    if (onDonateClick) onDonateClick(60);
  };

  const handleSkipToDonate = () => {
    setShowDonatePrompt(false);
    openRaffle();
  };

  return (
    <>
      <Helmet>
        <title>Community Raffle | Enter to Win $1000</title>
        <meta
          name="description"
          content="Watch our story and enter the community raffle to win $1000 while supporting families in need."
        />
      </Helmet>

      <div className="site-page min-h-screen py-12 pt-24">

        {/* Video-end donate prompt modal */}
        {showDonatePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="max-w-md w-full rounded-[2rem] border border-white/10 bg-[#101a4d] p-10 text-center relative shadow-2xl text-white">
              <button
                onClick={() => setShowDonatePrompt(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white/70"
              >
                <X size={22} />
              </button>

              <div className="text-7xl mb-4">☕</div>
              <h2 className="font-display text-4xl font-semibold uppercase text-white mb-3 leading-tight">
                You've seen the story.<br />
                <span className="text-[#efd37a]">Now make a difference.</span>
              </h2>
              <p className="text-white/88 text-lg mb-8">
                A family is waiting for Shabbos. One donation can fill that fridge.
                Will you be the one to say yes?
              </p>

              <Button
                onClick={handleDonate}
                className="mb-4 w-full rounded-full bg-[#e8cc74] py-6 text-xl font-extrabold uppercase tracking-[0.08em] text-[#091031] shadow-lg transition-all hover:scale-105 hover:bg-[#f1d989]"
              >
                Yes, I Want to Donate 💛
              </Button>

              <button
                onClick={handleSkipToDonate}
                className="text-white/40 hover:text-white/70 text-sm underline underline-offset-2 transition-colors"
              >
                No thanks, just enter the raffle
              </button>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          <div className="text-center mb-12">
            <span className="site-eyebrow px-5 py-1.5">Community Raffle</span>
            <h1 className="font-display mt-6 text-5xl md:text-6xl font-semibold uppercase text-white mb-4 max-w-4xl mx-auto leading-[0.92]">
              She asked a stranger to walk into a grocery store with her. <span className="text-[#efd37a]">This is why.</span>
            </h1>
            <p className="text-xl text-white/88 max-w-3xl mx-auto">
              Watch this woman's story, then enter to win $1,000. Entering the raffle requires your address.
            </p>
          </div>

          <section className="site-shell rounded-[2rem] overflow-hidden mb-10">
            <div className="w-full aspect-video">
              <iframe
                ref={iframeRef}
                src={settings.videoEmbedUrl}
                onLoad={() => {
                  console.info('Raffle iframe loaded', {
                    provider: settings.videoProvider,
                    embedUrl: settings.videoEmbedUrl,
                  });
                }}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Chasdei Mordechai Story"
              />
            </div>

            {/* Progress bar */}
            {!unlocked && (
              <div className="px-8 pt-4 pb-2">
                <div className="mb-1 flex justify-between text-xs text-white/40">
                  <span>Watch progress</span>
                  <span>{Math.round(progress * 100)}% / 50% needed to unlock</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#e8cc74] transition-all duration-300"
                    style={{ width: `${Math.min(progress * 100 / WATCH_THRESHOLD, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-8 text-center">
              <Gift className="mx-auto mb-4 text-[#efd37a]" size={48} />
              <h2 className="font-display text-4xl font-semibold uppercase text-white mb-3">Watch and Enter to Win $1,000!</h2>
              <p className="text-lg text-white/88 mb-8 max-w-2xl mx-auto">
                {unlocked
                  ? "You've watched enough — you're eligible to enter! Click below."
                  : 'Watch at least half the video to unlock your free raffle entry.'}
              </p>

              {unlocked ? (
                <Button
                  onClick={openRaffle}
                  className="rounded-full bg-[#e8cc74] px-12 py-8 text-xl font-extrabold uppercase tracking-[0.12em] text-[#091031] shadow-lg transition-all hover:scale-105 hover:bg-[#f1d989]"
                >
                  ENTER THE RAFFLE NOW
                  <ArrowRight className="ml-2" size={24} />
                </Button>
              ) : (
                <div className="inline-flex cursor-not-allowed select-none items-center gap-3 rounded-full border border-white/10 bg-white/5 px-12 py-5 text-xl font-bold text-white/35">
                  <Lock size={20} />
                  Watch to Unlock Entry
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="site-shell rounded-[1.6rem] p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e8cc74] text-[#091031]">1</div>
                Why a Raffle?
              </h3>
              <p className="leading-relaxed text-white/88">
                We believe in rewarding those who take the time to learn about the hidden struggles in our community. Spreading awareness is just as crucial as monetary support.
              </p>
            </div>
            <div className="site-shell rounded-[1.6rem] p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e8cc74] text-[#091031]">2</div>
                How it Works
              </h3>
              <p className="leading-relaxed text-white/88">
                Watch the video above, then click the button to enter your details and address. Winners will be contacted directly via email and phone. No donation required to enter.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RafflePage;
