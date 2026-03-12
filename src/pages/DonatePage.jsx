
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight, Heart } from 'lucide-react';

const DonatePage = ({ onDonateClick }) => {
  return (
    <div className="bg-[#fdfbf7] pb-20 pt-20">
      <Helmet>
        <title>Donate | Chasdei Mordechai</title>
        <meta
          name="description"
          content="Make a secure donation to Chasdei Mordechai. Feed a family in crisis."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/1009.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-lg">
            Shabbos Is Coming.<br />Her Fridge Is Empty.
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-medium">
            Hashem placed this moment in your hands. You are the power to say YES.
          </p>
          <Button 
            onClick={() => onDonateClick(60)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 py-6 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Donate Now
          </Button>
        </div>
      </section>

      {/* Section 2: Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <Heart className="mx-auto text-orange-500 mb-4" size={40} />
          <p className="text-2xl text-gray-800 font-medium leading-relaxed">
            A mother stands before an empty fridge, calculating how to make Shabbos this week. She hides her panic with a smile.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Even as her children ask, "Is there more chicken?" or "Can I have more sweet potato?" — she has no answer. This isn't far away. It's happening right here, in our community.
          </p>
        </div>
      </section>

      {/* Section 3: Donation Cards with Images */}
      <section className="py-20 bg-[#fdfbf7] border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">This Is Where You Step In.</h2>
            <p className="text-gray-600">Hundreds of donors have already said, "I won't let a family face Shabbos like this."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 */}
            <div 
              onClick={() => onDonateClick(120)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://horizons-cdn.hostinger.com/1084070f-ea28-4c68-a5d2-91589f967163/bdac3a76366932238b44ef48a7ab23ae.png" 
                  alt="Family at Shabbos table with traditional foods" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-3xl font-bold">$120</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">Feed an Entire Family</h3>
                <p className="text-gray-600 mb-6 flex-grow">A full Shabbos table. Fish. Chicken. Kugel. Everything.</p>
                <div className="text-primary font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2 (Popular) */}
            <div 
              onClick={() => onDonateClick(60)}
              className="bg-primary text-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(23,37,84,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
            >
              <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">POPULAR</div>
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://horizons-cdn.hostinger.com/1084070f-ea28-4c68-a5d2-91589f967163/6b669c963b859e9851d69c5b09bd35a4.png" 
                  alt="Children sharing food and joy" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-4xl font-bold drop-shadow-md">$60</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white">Fill the Fridge</h3>
                <p className="text-primary-foreground/90 mb-6 flex-grow">The essentials that turn a week of panic into peace.</p>
                <div className="text-accent font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => onDonateClick(12)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className="h-48 bg-orange-50 relative flex items-center justify-center border-b border-orange-100">
                <Heart className="text-orange-300 w-24 h-24 absolute opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-4xl font-bold text-orange-600 relative z-10">$12</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">One Child's Shabbos</h3>
                <p className="text-gray-600 mb-6 flex-grow">Ensure one child feels the full joy of the day.</p>
                <div className="text-primary font-medium flex items-center">
                  Select <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-6">
            <Button 
              onClick={() => onDonateClick(60)}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xl py-8 rounded-xl shadow-xl"
            >
              YES. I WILL BE THE ANSWER.
            </Button>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center"><Shield className="w-4 h-4 mr-1 text-green-500" /> Secure Processing</span>
              <span className="flex items-center"><Lock className="w-4 h-4 mr-1 text-gray-400" /> 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Closing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/1010.png"
                alt="Children sitting at an empty table"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="text-center lg:text-left space-y-6">
              <div className="w-24 h-1 bg-accent rounded-full mx-auto lg:mx-0"></div>
              <h2 className="text-3xl font-bold text-gray-900">It takes less than a minute.</h2>
              <p className="text-lg text-gray-600">
                But for this mother, it changes the entire week. <span className="font-bold text-gray-900">You are the answer she's been waiting for.</span>
              </p>
              <Button
                onClick={() => onDonateClick(60)}
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-xl shadow-xl"
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
