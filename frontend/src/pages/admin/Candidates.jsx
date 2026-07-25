import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, FileText, CheckCircle2, Search } from 'lucide-react';

export const Candidates = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Candidates</h1>
          <p className="text-text-secondary">Review applicants and their AI vectorization status.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-secondary border-b border-border">
              <tr>
                <th className="p-4 font-bold text-primary">Candidate</th>
                <th className="p-4 font-bold text-primary">Applied Role</th>
                <th className="p-4 font-bold text-primary">Status</th>
                <th className="p-4 font-bold text-primary">Resume</th>
                <th className="p-4 font-bold text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Dummy data until we wire up the Candidate API endpoint for HR */}
              <tr className="hover:bg-background-secondary/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-primary">John Doe</div>
                      <div className="text-sm text-text-secondary">john@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">Frontend Engineer</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-success text-sm font-medium">
                    <CheckCircle2 size={16} /> Vectorized
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 text-text-secondary">
                    <FileText size={16} /> Structured
                  </Button>
                </td>
                <td className="p-4 text-right">
                  <Button variant="secondary" size="sm">View Profile</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
