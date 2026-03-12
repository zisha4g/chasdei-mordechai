
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onDonateClick }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-orange-50/30 pb-20">
      <Helmet>
        <title>Chasdei Mordechai | Restoring Dignity</title>
        <meta
          name="description"
          content="When Shabbos approaches and the fridge is empty, your gift restores peace, dignity, and a full table."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/1000.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        >
          {/* Subtle dark overlay for readability without being too somber */}
          <div className="absolute inset-0 bg-black/45 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-orange-300 font-bold tracking-widest uppercase mb-4 text-sm md:text-base bg-orange-900/40 px-5 py-1.5 rounded-full border border-orange-400/30 backdrop-blur-sm"
          >
            Bring Light to Their Home
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
          >
            UH OH.<br />THERE IS NO MILK.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-3xl text-gray-100 mb-4 max-w-3xl font-medium drop-shadow-md"
          >
            For you, it's an inconvenience. <br className="hidden md:block"/>
            <span className="text-orange-200">For Chaim, it's a crisis.</span>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto italic"
          >
            "Eight children. Empty fridge. Shabbos approaching."
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button 
              onClick={() => onDonateClick(120)}
              className="bg-primary hover:bg-primary/90 text-white text-xl px-10 py-8 rounded-xl shadow-[0_10px_40px_rgba(23,37,84,0.4)] hover:shadow-[0_15px_50px_rgba(23,37,84,0.6)] hover:-translate-y-1 transition-all duration-300 group"
            >
              The Anxiety Is Real - Donate Now
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
            </Button>
            <button
              onClick={() => navigate('/raffle')}
              className="flex items-center gap-3 text-white border-2 border-white/70 hover:border-white hover:bg-white/10 text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 group"
            >
              <span className="w-10 h-10 flex items-center justify-center bg-white/20 group-hover:bg-white/30 rounded-full transition">
                <Play size={18} className="ml-0.5" fill="white" />
              </span>
              Watch &amp; Win $1,000
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Cards */}
      <section className="py-20 bg-[#fdfbf7] relative -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">YOU CAN CHANGE THAT.</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">$120</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Restore the Whole Table</h3>
              <p className="text-gray-600 mb-8 flex-grow">A full Shabbos for a family of eight.</p>
              <Button onClick={() => onDonateClick(120)} variant="outline" className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white py-6">
                Give $120
              </Button>
            </div>

            {/* Card 2 (Featured) */}
            <div className="bg-primary rounded-2xl p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(23,37,84,0.3)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center transform md:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-bl-lg">MOST NEEDED</div>
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6 mt-2">
                <span className="text-2xl font-bold">$60</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fill the Fridge</h3>
              <p className="text-white/80 mb-8 flex-grow">Proteins and dairy for the week.</p>
              <Button onClick={() => onDonateClick(60)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-bold shadow-lg">
                Give $60
              </Button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">$12</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">One Child's Peace</h3>
              <p className="text-gray-600 mb-8 flex-grow">A lechtiga Shabbos meal for little Chany.</p>
              <Button onClick={() => onDonateClick(12)} variant="outline" className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white py-6">
                Give $12
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Impact */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group border-4 border-white">
              <img
                src="/images/1004.png"
                alt="Happy family at Shabbos table with candles and challah"
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium text-sm">
                <Heart size={16} fill="currentColor" />
                <span>A Community Responsibility</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Chaim's harchavas hadaas hangs by a thread.
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Your generosity doesn't just put food on a table.
                </p>
                <p>
                  It restores kavod Shabbos. It transforms their week.
                </p>
                <p className="font-semibold text-gray-900">
                  One decision now can replace panic with peace before candle lighting.
                </p>
              </div>
              
              <div className="pt-6">
                <Button 
                  onClick={() => onDonateClick(60)}
                  className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 w-full sm:w-auto shadow-xl"
                >
                  YES. I WILL BE THE ANSWER.
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Closing CTA */}
      <section className="py-24 bg-primary text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/1004.png"
            alt="Children enjoying food together"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Shabbos doesn't wait. Don't close this page while Chaim's fridge is still empty.
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            It takes less than a minute to give, and the impact lasts all week.
          </p>
          <Button 
            onClick={() => onDonateClick(120)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-8 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300"
          >
            FILL THE FRIDGE NOW
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
