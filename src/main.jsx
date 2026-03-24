
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { RaffleProvider } from '@/contexts/RaffleContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <SupabaseAuthProvider>
    <RaffleProvider>
      <App />
    </RaffleProvider>
  </SupabaseAuthProvider>
);
