import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Shield, Key, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';


export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    const formData = new FormData(e.target);
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Password updated successfully');
        e.target.reset();
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Account Settings</h1>
        <p className="text-text-secondary">Manage your admin preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Shield size={20} className="text-accent" /> Security
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            Update your password and secure your account.
          </p>
        </div>
        
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {message && <div className="p-3 bg-success/10 text-success rounded-md text-sm">{message}</div>}
            {error && <div className="p-3 bg-error/10 text-error rounded-md text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Key size={16} />
                </div>
                <input 
                  required 
                  name="newPassword" 
                  type="password" 
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary" 
                  placeholder="At least 8 characters" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Key size={16} />
                </div>
                <input 
                  required 
                  name="confirmPassword" 
                  type="password" 
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary" 
                  placeholder="Confirm password" 
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                <Save size={18} /> {loading ? 'Saving...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
