
import React, { useState, useEffect } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// ── DonorFuse donation link and campaign ID
const DF_LINK = 'cm';  // URL slug from https://donate.donorfuse.com/cm
const DF_CAMPAIGN_ID = 11426; // $1,000 Raffle 3

const DonationForm = ({ isOpen, onClose, onSuccess, initialAmount }) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(initialAmount || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (initialAmount) setAmount(initialAmount);
  }, [initialAmount]);

  const amounts = [
    { value: 12, label: "One Child's Peace" },
    { value: 60, label: "Fill the Fridge" },
    { value: 120, label: "Restore the Table" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      toast({ title: "Missing Information", description: "Please provide your first name and email.", variant: "destructive" });
      return;
    }

    if (!window.DonorFuseClient) {
      toast({ title: "Payment unavailable", description: "Please refresh the page and try again.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    onClose(); // close our modal before opening DonorFuse popup

    const rawPhone = (formData.phone || '').replace(/\D/g, '');
    const phone = rawPhone ? (rawPhone.startsWith('1') ? rawPhone : `1${rawPhone}`) : undefined;

    const options = {
      link: DF_LINK,
      campaign: DF_CAMPAIGN_ID,
      amount,
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      email: formData.email,
      phone: phone || undefined,
    };

    window.DonorFuseClient.ShowPopup(options, (result) => {
      setIsSubmitting(false);
      // DonorFuse passes true (boolean) on successful payment, and false/object/undefined on cancel
      const didDonate = result === true || result?.success === true || result?.donated === true;
      if (didDonate) {
        onSuccess({ firstName: formData.firstName, amount });
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <Heart className="mx-auto text-primary mb-4" size={40} />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Be the Answer</h2>
            <p className="text-gray-600">Your gift brings immediate relief to a family in crisis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Amount</label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setAmount(preset.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      amount === preset.value
                        ? 'border-primary bg-primary/5 text-primary scale-[1.02]'
                        : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl font-bold">${preset.value}</span>
                    <span className="text-xs text-center font-medium leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label htmlFor="customAmount" className="text-sm font-medium text-gray-700">Custom Amount ($)</label>
              <input
                type="number"
                id="customAmount"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-lg font-semibold"
              />
            </div>

            {/* Donor Details */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 animate-spin" size={20} /> Opening…</>
              ) : (
                `Continue to Donate $${amount}`
              )}
            </Button>
            <p className="text-xs text-center text-gray-500">
              Secure, encrypted payment via DonorFuse. Your card data never touches our servers.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
