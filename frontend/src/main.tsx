import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SettingsProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#f3f4f6',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#06b6d4',
                  secondary: '#f3f4f6',
                },
              },
            }}
          />
        </SettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
