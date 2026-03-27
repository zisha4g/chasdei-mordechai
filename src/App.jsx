
import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import { initGA4, trackPageView, trackReferrer, startPageTimer, stopPageTimer } from '@/lib/analytics';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA4();
    trackReferrer();
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    stopPageTimer();
    trackPageView(path);
    startPageTimer(path);
    return () => { stopPageTimer(); };
  }, [location]);

  return null;
}
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import DonatePage from '@/pages/DonatePage';
import AboutPage from '@/pages/AboutPage';
import RafflePage from '@/pages/RafflePage';
import ContactPage from '@/pages/ContactPage';
import ThankYouPage from '@/pages/ThankYouPage';
import AdminPage from '@/pages/AdminPage';
import AnalyticsReportPage from '@/pages/AnalyticsReportPage';
import DonationForm from '@/components/DonationForm';
import RaffleEntryModal from '@/components/RaffleEntryModal';
import { Toaster } from '@/components/ui/toaster';

function AppContent() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(60);

  const openDonationForm = (amount = 60) => {
    setSelectedAmount(amount);
    setIsFormOpen(true);
  };

  const handleDonationSuccess = (data) => {
    setIsFormOpen(false);
    const name = encodeURIComponent(data.firstName || '');
    const amount = encodeURIComponent(data.amount || '');
    navigate(`/thank-you?name=${name}&amount=${amount}`, { state: { donor: data } });
  };

  return (
    <>
      <PageTracker />
      <ScrollToTop />
      <Routes>
        {/* Admin — standalone, no site chrome */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/report" element={<AnalyticsReportPage />} />
        <Route path="/admin/thankyou" element={
          <div className="flex flex-col min-h-screen bg-[#0b123a]">
            <Header onDonateClick={openDonationForm} />
            <main className="flex-grow" style={{ paddingTop: '4px' }}>
              <ThankYouPage requireDonation={false} />
            </main>
            <Footer onDonateClick={openDonationForm} />
          </div>
        } />

        {/* Thank-you — dedicated route with explicit site chrome */}
        <Route path="/thank-you" element={
          <div className="flex flex-col min-h-screen bg-[#0b123a]">
            <Header onDonateClick={openDonationForm} />
            <main className="flex-grow" style={{ paddingTop: '4px' }}>
              <ThankYouPage />
            </main>
            <Footer onDonateClick={openDonationForm} />
            <DonationForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSuccess={handleDonationSuccess}
              initialAmount={selectedAmount}
            />
            <RaffleEntryModal />
            <Toaster />
          </div>
        } />

        {/* Public site */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen bg-[#0b123a]">
            <Header onDonateClick={openDonationForm} />
            <main className="flex-grow" style={{ paddingTop: '4px' }}>
              <Routes>
                <Route path="/" element={<HomePage onDonateClick={openDonationForm} />} />
                <Route path="/donate" element={<DonatePage onDonateClick={openDonationForm} />} />
                <Route path="/about-us" element={<AboutPage onDonateClick={openDonationForm} />} />
                <Route path="/raffle" element={<RafflePage onDonateClick={openDonationForm} />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<Navigate to="/about-us" replace />} />
                <Route path="/gallery" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer onDonateClick={openDonationForm} />
            <DonationForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSuccess={handleDonationSuccess}
              initialAmount={selectedAmount}
            />
            <RaffleEntryModal />
            <Toaster />
          </div>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
