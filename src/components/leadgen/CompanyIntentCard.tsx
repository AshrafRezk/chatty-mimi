
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadIntent } from '@/types/leadGenAI';

interface CompanyIntentCardProps {
  intent: LeadIntent;
}

const CompanyIntentCard: React.FC<CompanyIntentCardProps> = ({ intent }) => {
  const getUrgencyColor = () => {
    const score = intent.urgencyScore;
    if (score >= 8) return "text-red-500 dark:text-red-400";
    if (score >= 5) return "text-amber-500 dark:text-amber-400";
    return "text-green-500 dark:text-green-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Company Intent Timeline</span>
          <span className={`text-sm font-normal ${getUrgencyColor()}`}>
            Urgency: {intent.urgencyScore}/10
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p>{intent.activitySummary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyIntentCard;
