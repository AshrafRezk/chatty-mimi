
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Chat from './pages/Chat';
import { ThemeProvider } from './hooks/use-theme';
import Features from './components/Features';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="mimi-theme">
        <ChatProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Footer is now conditionally rendered based on route */}
            <Footer />
          </Router>
        </ChatProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
