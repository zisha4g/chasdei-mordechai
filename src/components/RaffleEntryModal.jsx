
import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRaffle } from '@/contexts/RaffleContext';
import { supabase } from '@/lib/customSupabaseClient';

const buildFullAddress = ({ addressLine1, city, state, postalCode }) => {
  const street = addressLine1.trim();
  const locality = city.trim();
  const region = state.trim();
  const zip = postalCode.trim();

  return `${street}, ${locality}, ${region} ${zip}`;
};

const RaffleEntryModal = () => {
  const { isOpen, closeRaffle } = useRaffle();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullAddress = buildFullAddress(formData);
    
    if (!formData.firstName || !formData.email || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your first name, email, street address, city, state, and ZIP code.",
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
          address: fullAddress,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You're entered to win $1000!",
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
      });
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#101a4d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl relative animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0a1239] border-b border-white/10 p-6 text-center text-white relative">
          <button 
            onClick={closeRaffle}
            className="absolute top-4 right-4 p-1 text-white/60 hover:text-white hover:bg-white/15 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <Gift className="mx-auto mb-3 text-[#efd37a]" size={40} />
          <h2 className="text-2xl font-bold text-white">Win $1,000!</h2>
          <p className="text-white/70 mt-2 text-sm">
            Enter our exclusive raffle as a thank you for your support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="raffle-firstName" className="text-sm font-medium text-white/80">First Name *</label>
              <input
                id="raffle-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="raffle-lastName" className="text-sm font-medium text-white/80">Last Name</label>
              <input
                id="raffle-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="raffle-email" className="text-sm font-medium text-white/80">Email *</label>
            <input
              id="raffle-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="raffle-phone" className="text-sm font-medium text-white/80">Phone</label>
            <input
              id="raffle-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="raffle-addressLine1" className="text-sm font-medium text-white/80">Street Address *</label>
            <input
              id="raffle-addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              autoComplete="address-line1"
              className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
              placeholder="123 Main St"
              required
            />
            <p className="text-xs text-white/45 mt-1">We'll use this to mail your check if you win.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(110px,0.7fr)_minmax(120px,0.8fr)] gap-4">
            <div className="space-y-1">
              <label htmlFor="raffle-city" className="text-sm font-medium text-white/80">City *</label>
              <input
                id="raffle-city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                autoComplete="address-level2"
                className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="raffle-state" className="text-sm font-medium text-white/80">State *</label>
              <input
                id="raffle-state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                autoComplete="address-level1"
                className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
                maxLength={30}
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="raffle-postalCode" className="text-sm font-medium text-white/80">ZIP Code *</label>
              <input
                id="raffle-postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                autoComplete="postal-code"
                className="w-full px-3 py-2 border border-white/15 rounded-md bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-[#e8cc74] focus:border-[#e8cc74] focus:outline-none transition-colors"
                minLength={5}
                maxLength={12}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#e8cc74] py-6 text-lg font-extrabold uppercase tracking-[0.08em] text-[#091031] mt-4 shadow-lg hover:bg-[#f1d989]"
          >
            {isSubmitting ? 'Entering...' : 'Enter to Win $1,000'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RaffleEntryModal;
