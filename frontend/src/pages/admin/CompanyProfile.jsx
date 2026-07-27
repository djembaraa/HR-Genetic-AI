import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Building, Save, Globe, Info, Image as ImageIcon } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const CompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [company, setCompany] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    logoUrl: ''
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Admin/HR dashboard route already returns company info via /api/admin/dashboard
      // Alternatively, we can just fetch it from there or a dedicated company GET if we had one for HR.
      const res = await fetchApi('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.company) {
        setCompany(data.company);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast.error('Failed to load company data');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/company/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(company)
      });
      
      if (res.ok) {
        toast.success('Company profile updated successfully');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  if (fetching) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Company Profile</h1>
        <p className="text-text-secondary">Manage how your company appears to candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Building size={20} className="text-accent" /> Public Info
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            This information will be displayed on your company's public detail page.
          </p>
        </div>
        
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input 
                disabled 
                label="Company Name" 
                value={company.name || ''} 
                helpText="Contact support to change company name."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Industry</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Building size={16} />
                </div>
                <input 
                  name="industry" 
                  value={company.industry || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                  placeholder="e.g. Technology, Finance, Healthcare" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Globe size={16} />
                </div>
                <input 
                  type="url"
                  name="website" 
                  value={company.website || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                  placeholder="https://example.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Logo URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <ImageIcon size={16} />
                </div>
                <input 
                  type="url"
                  name="logoUrl" 
                  value={company.logoUrl || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                  placeholder="https://example.com/logo.png" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">About the Company</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-text-muted">
                  <Info size={16} />
                </div>
                <textarea 
                  name="description" 
                  rows="5"
                  value={company.description || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none" 
                  placeholder="Tell candidates about your company's mission, culture, and benefits..." 
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                <Save size={18} /> {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
