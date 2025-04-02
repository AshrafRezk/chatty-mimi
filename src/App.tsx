import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Chat from './pages/Chat';
import { ThemeProvider } from './hooks/use-theme';
import Features from './components/Features';
import Footer from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="mimi-theme">
        <ChatProvider>
          <SEOHead />
          <Chat />
          <Features />
          <Footer />
        </ChatProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
