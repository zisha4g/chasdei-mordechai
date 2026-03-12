
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-8 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative w-full overflow-hidden rounded-t-2xl bg-black">
          <img 
            src="/images/1007.png" 
            alt="Happy children at the Shabbos table" 
            className="w-full max-h-[40vh] object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex items-end">
            <div className="p-5 sm:p-8 w-full">
              <div className="flex items-center gap-3 mb-2 pr-10">
                <CheckCircle className="text-green-400" size={32} />
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-md break-words">
                  You did it, <span dir="auto">{donorData.firstName}</span>!
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4 text-gray-700">
            <p className="text-xl font-medium text-gray-900 leading-relaxed">
              You just replaced a father's nightmare with a table full of food and a heart full of hope.
            </p>
            <p className="italic text-gray-600 border-l-4 border-orange-400 pl-4">
              Because of your kindness, Chaim can put his worries aside and sing Zemiros with his children in true simcha.
            </p>
            <p className="font-semibold text-gray-900">
              Your gift of <span className="text-primary font-bold">${donorData.amount}</span> was a lifeline — it restored a father's dignity and a family's peace.
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900">Don't forget your raffle entry!</h4>
              <p className="text-sm text-gray-600">As a thank you, you're eligible to win $1,000.</p>
            </div>
            <Button onClick={handleOpenRaffle} className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">
              Enter Raffle Now
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Join the Family</h3>
            <p className="text-gray-600 mb-5">
              Don't let the connection end here. Receive monthly family updates and see exactly how your generosity continues to restore homes, tables, and hearts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleJoinUpdates}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
              >
                <Mail className="mr-2" size={20} />
                Join the Family Updates
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 py-6 text-lg border-gray-300 text-gray-700 hover:bg-gray-100"
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
