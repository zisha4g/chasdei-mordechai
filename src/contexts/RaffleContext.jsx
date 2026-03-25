
import React, { createContext, useContext, useState } from 'react';

const RaffleContext = createContext(null);

export const useRaffle = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};

export const RaffleProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const openRaffle = (data = null) => { setPrefillData(data); setIsOpen(true); };
  const closeRaffle = () => { setIsOpen(false); setPrefillData(null); };

  return (
    <RaffleContext.Provider value={{ isOpen, openRaffle, closeRaffle, prefillData }}>
      {children}
    </RaffleContext.Provider>
  );
};
