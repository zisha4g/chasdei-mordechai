
import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import DonatePage from '@/pages/DonatePage';
import AboutPage from '@/pages/AboutPage';
import RafflePage from '@/pages/RafflePage';
import AdminPage from '@/pages/AdminPage';
import DonationForm from '@/components/DonationForm';
import DonationModal from '@/components/DonationModal';
import RaffleEntryModal from '@/components/RaffleEntryModal';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(60);
  const [donorData, setDonorData] = useState(null);

  const openDonationForm = (amount = 60) => {
    setSelectedAmount(amount);
    setIsFormOpen(true);
  };

  const handleDonationSuccess = (data) => {
    setIsFormOpen(false);
    setDonorData(data);
    setIsSuccessOpen(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin — standalone, no site chrome */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Public site */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Header onDonateClick={openDonationForm} />
            <main className="flex-grow pt-16 md:pt-20">
              <Routes>
                <Route path="/" element={<HomePage onDonateClick={openDonationForm} />} />
                <Route path="/donate" element={<DonatePage onDonateClick={openDonationForm} />} />
                <Route path="/about-us" element={<AboutPage onDonateClick={openDonationForm} />} />
                <Route path="/raffle" element={<RafflePage />} />
                <Route path="/about" element={<Navigate to="/about-us" replace />} />
                <Route path="/gallery" element={<Navigate to="/" replace />} />
                <Route path="/contact" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <DonationForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSuccess={handleDonationSuccess}
              initialAmount={selectedAmount}
            />
            <DonationModal
              isOpen={isSuccessOpen}
              onClose={() => setIsSuccessOpen(false)}
              donorData={donorData}
            />
            <RaffleEntryModal />
            <Toaster />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
