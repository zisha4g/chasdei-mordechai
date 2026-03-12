
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Gift, ArrowRight, Lock } from 'lucide-react';
import { useRaffle } from '@/contexts/RaffleContext';

const VIDEO_SRC = '/images/Chasdei_Mordechai_Shull_background (1) (1).mp4';
// Fraction of video that must be watched before raffle unlocks (0.5 = 50%)
const WATCH_THRESHOLD = 0.5;

const RafflePage = () => {
  const { openRaffle } = useRaffle();
  const videoRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || unlocked) return;
    const pct = vid.currentTime / vid.duration;
    setProgress(pct);
    if (pct >= WATCH_THRESHOLD) setUnlocked(true);
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

      <div className="min-h-screen bg-[#fdfbf7] py-12 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              See The Impact. <span className="text-primary">Win $1,000.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch the story below — then unlock your free raffle entry.
            </p>
          </div>

          {/* Video Section */}
          <section className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10 border border-gray-100">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="w-full aspect-video bg-black object-contain"
            />

            {/* Progress bar */}
            {!unlocked && (
              <div className="px-8 pt-4 pb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Watch progress</span>
                  <span>{Math.round(progress * 100)}% / 50% needed to unlock</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress * 100 / WATCH_THRESHOLD, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
              <Gift className="mx-auto text-accent mb-4" size={48} />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Watch and Enter to Win $1,000!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {unlocked
                  ? "You've watched enough — you're eligible to enter! Click below."
                  : 'Watch at least half the video to unlock your free raffle entry.'}
              </p>

              {unlocked ? (
                <Button
                  onClick={openRaffle}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-8 rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  ENTER THE RAFFLE NOW
                  <ArrowRight className="ml-2" size={24} />
                </Button>
              ) : (
                <div className="inline-flex items-center gap-3 bg-gray-100 text-gray-400 font-bold text-xl px-12 py-5 rounded-xl cursor-not-allowed select-none">
                  <Lock size={20} />
                  Watch to Unlock Entry
                </div>
              )}
            </div>
          </section>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">1</div>
                Why a Raffle?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in rewarding those who take the time to learn about the hidden struggles in our community. Spreading awareness is just as crucial as monetary support.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">2</div>
                How it Works
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Watch the video above, then click the button to enter your details. Winners will be contacted directly via email and phone. No donation required to enter.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RafflePage;
