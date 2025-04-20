
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import SalesforceConnections from '@/components/SalesforceConnections';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <HelmetProvider>
      <SEOHead
        title="Profile | Mimi AI"
        description="Manage your profile and connections"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>
        <SalesforceConnections />
      </div>
    </HelmetProvider>
  );
};

export default Profile;
