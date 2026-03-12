
import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRaffle } from '@/contexts/RaffleContext';
import { supabase } from '@/lib/customSupabaseClient';

const RaffleEntryModal = () => {
  const { isOpen, closeRaffle } = useRaffle();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide your first name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('raffle_entries')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You're entered to win $1000!",
      });

      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      closeRaffle();
    } catch (error) {
      console.error('Error submitting raffle:', error);
      toast({
        title: "Error",
        description: error.message || "Could not submit your entry. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="bg-primary p-6 text-center text-white relative">
          <button 
            onClick={closeRaffle}
            className="absolute top-4 right-4 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <Gift className="mx-auto mb-3" size={40} />
          <h2 className="text-2xl font-bold">Win $1,000!</h2>
          <p className="text-primary-foreground/90 mt-2 text-sm">
            Enter our exclusive raffle as a thank you for your support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="raffle-firstName" className="text-sm font-medium text-gray-700">First Name *</label>
              <input
                id="raffle-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="raffle-lastName" className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="raffle-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="raffle-email" className="text-sm font-medium text-gray-700">Email *</label>
            <input
              id="raffle-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="raffle-phone" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              id="raffle-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-lg mt-4 shadow-lg"
          >
            {isSubmitting ? 'Entering...' : 'Enter to Win'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RaffleEntryModal;
