
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { LeadSearchHistory } from '@/types/leadGenAI';
import { Clock } from 'lucide-react';

const LeadSearchHistory: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<LeadSearchHistory[]>([]);
  const { user } = useAuth();
  const { addMessage } = useChat();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('lead_search_history_details')
        .select('*')
        .order('searched_at', { ascending: false });

      if (error) {
        console.error('Error fetching search history:', error);
        return;
      }

      setSearchHistory(data || []);
    };

    fetchSearchHistory();
  }, [user]);

  const handleContinueInChat = (history: LeadSearchHistory) => {
    const chatMessage = `I want to discuss a lead from my search history:

Company: ${history.provider_company}
Services: ${history.provider_services}
Target Client: ${history.target_client}

Contacts: ${history.contacts?.map(c => `${c.name} (${c.title})`).join(', ')}

Intent: ${history.intent?.activity_summary}
Urgency Score: ${history.intent?.urgency_score}/10

Sales Plan Strategy:
Cold Call Script: ${history.sales_plan?.cold_call_script}
Email Sequence: ${history.sales_plan?.email_sequence}
Marketing Tips: ${history.sales_plan?.marketing_tips}

Can you help me strategize my approach?`;

    addMessage({
      text: chatMessage,
      sender: 'user',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Clock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Lead Search History</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Provider Company</TableHead>
              <TableHead>Target Client</TableHead>
              <TableHead>Search Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchHistory.map((history) => (
              <TableRow key={history.id}>
                <TableCell>
                  {new Date(history.searched_at || '').toLocaleDateString()}
                </TableCell>
                <TableCell>{history.provider_company}</TableCell>
                <TableCell>{history.target_client}</TableCell>
                <TableCell>{history.search_type}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContinueInChat(history)}
                  >
                    Continue in Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default LeadSearchHistory;
