
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesforceConnection {
  id: string;
  instance_url: string;
  last_sync_at: string | null;
  last_sync_status: string | null;
  created_at: string;
}

const SalesforceConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<SalesforceConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('salesforce_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error: any) {
      toast.error('Failed to load Salesforce connections');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      // Generate a unique state for OAuth
      const state = crypto.randomUUID();

      // Store the state in Supabase
      const { error: stateError } = await supabase
        .from('salesforce_oauth_states')
        .insert([{ state, user_id: user?.id }]);

      if (stateError) throw stateError;

      // Construct OAuth URL
      const clientId = import.meta.env.VITE_SALESFORCE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/salesforce/callback`;
      const loginUrl = 'https://login.salesforce.com'; // Use .sandbox.salesforce.com for sandbox

      const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('scope', 'api refresh_token');

      // Redirect to Salesforce login
      window.location.href = authUrl.toString();
    } catch (error: any) {
      toast.error('Failed to initiate Salesforce connection');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Salesforce Connections</h2>
        <Button onClick={handleConnect}>
          Connect Salesforce Org
        </Button>
      </div>

      {connections.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instance URL</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connected On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell>{connection.instance_url}</TableCell>
                <TableCell>
                  {connection.last_sync_at ? 
                    new Date(connection.last_sync_at).toLocaleDateString() : 
                    'Never'
                  }
                </TableCell>
                <TableCell>{connection.last_sync_status || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(connection.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No Salesforce connections yet. Click the button above to connect your first org.
        </div>
      )}
    </div>
  );
};

export default SalesforceConnections;
