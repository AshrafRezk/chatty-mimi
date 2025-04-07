
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import Chat from './pages/Chat';
import { ThemeProvider } from './hooks/use-theme';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Auth from './pages/Auth';
import InMemory from './pages/InMemory';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";

// Separate component for footer to use useLocation hook
const FooterWithLocation = () => {
  const location = useLocation();
  return location.pathname !== '/chat' ? <Footer /> : null;
};

// Wrapper component for routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/in-memory" element={<InMemory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <FooterWithLocation />
    </>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="mimi-theme">
        <Router>
          <AuthProvider>
            <ChatProvider>
              <AnimatedRoutes />
              <Toaster />
            </ChatProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
