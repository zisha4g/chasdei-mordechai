
import React from 'react';
import { X, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRaffle } from '@/contexts/RaffleContext';

const DonationModal = ({ isOpen, onClose, donorData }) => {
  const { toast } = useToast();
  const { openRaffle } = useRaffle();

  if (!isOpen || !donorData) return null;

  const handleJoinUpdates = () => {
    toast({
      title: "Welcome to the Family!",
      description: "You've been added to our updates list.",
    });
    onClose();
  };

  const handleOpenRaffle = () => {
    onClose();
    openRaffle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-h-[90vh] max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#101a4d] text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative w-full overflow-hidden rounded-t-2xl bg-black">
          <img 
            src="/images/ty-page.png" 
            alt="Happy children at the Shabbos table" 
            className="w-full max-h-[40vh] object-contain"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#091031]/95 via-[#091031]/45 to-transparent">
            <div className="p-5 sm:p-8 w-full">
              <div className="flex items-center gap-3 mb-2 pr-10">
                <CheckCircle className="text-green-400" size={32} />
                <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase leading-tight break-words">
                  You did it, <span dir="auto">{donorData.firstName}</span>!
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-8">
          <div className="space-y-4 text-white/88">
            <p className="text-xl font-medium text-white leading-relaxed">
              You just replaced a father's nightmare with a table full of food and a heart full of hope.
            </p>
            <p className="border-l-4 border-[#efd37a] pl-4 italic text-white/85">
              Because of your kindness, Chaim can put his worries aside and sing Zemiros with his children in true simcha.
            </p>
            <p className="font-semibold text-white">
              Your gift of <span className="text-primary font-bold">${donorData.amount}</span> was a lifeline — it restored a father's dignity and a family's peace.
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:flex-row">
            <div>
              <h4 className="font-bold text-white">Don't forget your raffle entry!</h4>
              <p className="text-sm text-white/58">As a thank you, you're eligible to win $1,000.</p>
            </div>
            <Button onClick={handleOpenRaffle} className="whitespace-nowrap rounded-full bg-[#e8cc74] px-6 text-[#091031] hover:bg-[#f1d989]">
              Enter Raffle Now
            </Button>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="mb-3 text-xl font-bold text-white">Join the Family</h3>
            <p className="mb-5 text-white/62">
              Don't let the connection end here. Receive monthly family updates and see exactly how your generosity continues to restore homes, tables, and hearts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleJoinUpdates}
                className="flex-1 rounded-full bg-[#e8cc74] py-6 text-lg font-extrabold text-[#091031] hover:bg-[#f1d989]"
              >
                <Mail className="mr-2" size={20} />
                Join the Family Updates
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 rounded-full border-white/14 bg-transparent py-6 text-lg text-white hover:bg-white/8 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
