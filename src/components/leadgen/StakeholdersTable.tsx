
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadStakeholder } from '@/types/leadGenAI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StakeholdersTableProps {
  stakeholders: LeadStakeholder[];
}

const StakeholdersTable: React.FC<StakeholdersTableProps> = ({ stakeholders }) => {
  if (!stakeholders || stakeholders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Target Stakeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No stakeholders found. Try a different search or company.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Stakeholders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholders.map((stakeholder, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{stakeholder.name}</TableCell>
                <TableCell>{stakeholder.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <a
                    href={stakeholder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                  {stakeholder.email && (
                    <div className="text-xs text-muted-foreground mt-1">{stakeholder.email}</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StakeholdersTable;
