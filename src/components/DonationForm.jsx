
import React, { useState, useEffect } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { hasRaffleEntryBeenLogged, trackDonateOpen, trackDonationCompleted, trackRaffleEntry } from '@/lib/analytics';

const DonationForm = ({ isOpen, onClose, onSuccess, initialAmount }) => {
  const { toast } = useToast();
  const { settings, refresh } = useSiteSettings();
  const donationDebugLabel = '[Donation Debug]';
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

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  // Log every postMessage from DonorFuse so we can see what it sends
  const amounts = [
    { value: 12, label: "One Child's Shabbos" },
    { value: 60, label: "Fill the Fridge" },
    { value: 120, label: "Feed an Entire Family" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDonationDecision = (result) => {
    if (!result || result === false) {
      return { isSuccess: false, reason: 'empty-result' };
    }

    const isExplicitCancel =
      result === null ||
      result === undefined ||
      result?.cancelled === true ||
      result?.canceled === true ||
      result?.status === 'cancelled' ||
      result?.status === 'canceled' ||
      result?.status === 'closed' ||
      result?.status === 'back' ||
      result?.closed === true;

    if (isExplicitCancel) {
      return { isSuccess: false, reason: 'explicit-cancel', result };
    }

    const paymentProof =
      result?.transactionId ||
      result?.transaction_id ||
      result?.paymentId ||
      result?.payment_id ||
      result?.confirmationId ||
      result?.confirmation_id ||
      result?.data?.transactionId ||
      result?.data?.transaction_id ||
      result?.data?.paymentId ||
      result?.data?.payment_id ||
      result?.data?.confirmationId ||
      result?.data?.confirmation_id;

    const reportedAmount = result?.data?.amount ?? result?.amount;
    const hasSuccessStatus =
      result?.success === true ||
      result?.status === 'success' ||
      result?.status === 'completed' ||
      result?.status === 'paid';

    if (!hasSuccessStatus) {
      return { isSuccess: false, reason: 'missing-success-status', paymentProof, reportedAmount, result };
    }

    if (!paymentProof) {
      return { isSuccess: false, reason: 'missing-payment-proof', reportedAmount, result };
    }

    if (reportedAmount == null || reportedAmount === '') {
      return { isSuccess: false, reason: 'missing-amount', paymentProof, result };
    }

    return { isSuccess: true, reason: 'confirmed-success', paymentProof, reportedAmount, result };
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
    trackDonateOpen(amount);
    onClose(); // close our modal before opening DonorFuse popup

    const rawPhone = (formData.phone || '').replace(/\D/g, '');
    const phone = rawPhone ? (rawPhone.startsWith('1') ? rawPhone : `1${rawPhone}`) : undefined;

    const options = {
      link: settings.donorFuseLink,
      campaign: settings.donorFuseCampaignId,
      amount,
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      email: formData.email,
      phone: phone || undefined,
    };

    console.log(donationDebugLabel, 'opening popup', {
      amount,
      link: options.link,
      campaign: options.campaign,
      firstName: formData.firstName,
      lastName: formData.lastName || null,
      email: formData.email,
      phone: phone || null,
    });

    window.DonorFuseClient.ShowPopup(options, (result) => {
      setIsSubmitting(false);

      const decision = getDonationDecision(result);
      console.log(donationDebugLabel, 'popup callback', {
        decision,
        result,
      });

      if (decision.isSuccess) {
        const actualAmount = decision.reportedAmount;
        trackDonationCompleted(actualAmount);
        if (!hasRaffleEntryBeenLogged()) {
          trackRaffleEntry();
        }
        onSuccess({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone, amount: actualAmount });
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      } else {
        console.log(donationDebugLabel, 'popup rejected', {
          reason: decision.reason,
          amount,
          result,
        });
        toast({
          title: 'Donation not completed',
          description: 'You can try again if you meant to finish the donation.',
          variant: 'destructive',
        });
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {amounts.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setAmount(preset.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      preset.value === 120 ? 'col-span-2 sm:col-span-1' : ''
                    } ${
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                `Donate & Enter Raffle $${amount}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
