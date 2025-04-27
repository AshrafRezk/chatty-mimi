
import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MimiAI - Your AI Assistant</title>
        <meta
          name="description"
          content="MimiAI is an advanced AI assistant designed to help you with your daily tasks."
        />
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />

          <div className="my-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/chat">
              <Button size="lg" variant="default">Chat with Mimi</Button>
            </Link>
            <Link to="/leadgenai">
              <Button size="lg" variant="outline">LeadGenAI (Sales Tools)</Button>
            </Link>
          </div>
          
          <Features />
        </motion.div>
      </div>
    </>
  );
};

export default Index;
