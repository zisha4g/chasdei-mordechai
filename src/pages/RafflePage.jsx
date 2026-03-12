
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Gift, PlayCircle, ArrowRight } from 'lucide-react';
import { useRaffle } from '@/contexts/RaffleContext';

const RafflePage = () => {
  const { openRaffle } = useRaffle();

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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">See The Impact. <span className="text-primary">Win $1,000.</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how your support transforms lives, then enter our exclusive community raffle as our way of saying thank you.
            </p>
          </div>

          {/* Video Section */}
          <section className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16 border border-gray-100">
            <div className="relative w-full aspect-video bg-gray-900 group cursor-pointer">
              <img 
                src="https://ahblicklive.com/new_ded_img/26/06/medium/Is9Tw2qZObkiXl0SPk1/aH0coQ7_wide_m.png" 
                alt="Community impact video" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <PlayCircle className="w-20 h-20 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
                <span className="mt-4 text-sm font-bold tracking-widest text-white uppercase drop-shadow-md">Watch Our Story</span>
              </div>
            </div>
            
            <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
              <Gift className="mx-auto text-accent mb-4" size={48} />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Watch and Enter to Win $1000!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Your awareness is the first step to helping families in our community. Enter your details below for a chance to win our grand prize.
              </p>
              <Button 
                onClick={openRaffle}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-8 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                ENTER THE RAFFLE NOW
                <ArrowRight className="ml-2" size={24} />
              </Button>
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
                Simply click the button above, enter your contact information, and you're automatically entered. Winners will be contacted directly via email and phone. No donation is strictly required to enter.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RafflePage;
