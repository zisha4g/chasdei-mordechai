
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

  const openRaffle = () => setIsOpen(true);
  const closeRaffle = () => setIsOpen(false);

  return (
    <RaffleContext.Provider value={{ isOpen, openRaffle, closeRaffle }}>
      {children}
    </RaffleContext.Provider>
  );
};
