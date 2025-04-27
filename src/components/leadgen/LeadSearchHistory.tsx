
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
import { LeadSearchHistoryItem } from '@/types/leadGenAI';
import { Clock } from 'lucide-react';

const LeadSearchHistoryDialog: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<LeadSearchHistoryItem[]>([]);
  const { user } = useAuth();
  const { addMessage } = useChat();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!user) return;

      try {
        // Cast the response type to our custom view type
        const { data, error } = await (supabase as any)
          .from('lead_search_history_details')
          .select('*')
          .order('searched_at', { ascending: false });

        if (error) {
          console.error('Error fetching search history:', error);
          return;
        }

        // Cast the data to our expected type
        setSearchHistory(data as LeadSearchHistoryItem[]);
      } catch (err) {
        console.error('Error in search history fetch:', err);
      }
    };

    fetchSearchHistory();
  }, [user]);

  const handleContinueInChat = (history: LeadSearchHistoryItem) => {
    // Parse stringified JSON fields if they exist
    const contactsData = history.contacts ? 
      (typeof history.contacts === 'string' ? JSON.parse(history.contacts as string) : history.contacts) : [];
      
    const intentData = history.intent ? 
      (typeof history.intent === 'string' ? JSON.parse(history.intent as string) : history.intent) : null;
      
    const salesPlanData = history.sales_plan ? 
      (typeof history.sales_plan === 'string' ? JSON.parse(history.sales_plan as string) : history.sales_plan) : null;

    const chatMessage = `I want to discuss a lead from my search history:

Company: ${history.provider_company}
Services: ${history.provider_services}
Target Client: ${history.target_client}

${contactsData.length > 0 ? `Contacts: ${contactsData.map((c: any) => `${c.name} (${c.title})`).join(', ')}` : ''}

${intentData ? `Intent: ${intentData.activity_summary}
Urgency Score: ${intentData.urgency_score}/10` : ''}

${salesPlanData ? `Sales Plan Strategy:
Cold Call Script: ${salesPlanData.cold_call_script}
Email Sequence: ${salesPlanData.email_sequence}
Marketing Tips: ${salesPlanData.marketing_tips}` : ''}

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

export default LeadSearchHistoryDialog;
