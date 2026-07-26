import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Phone, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';


export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetchApi('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.candidate) {
            setProfile({
              name: data.candidate.name || '',
              phone: data.candidate.phone || '',
              email: data.email
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: profile.name, phone: profile.phone })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Profile updated successfully');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-text-secondary">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-text-secondary">Update your personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <User size={20} className="text-accent" /> Basic Info
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            This information will be used on your resume and applications.
          </p>
        </div>
        
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {message && <div className="p-3 bg-success/10 text-success rounded-md text-sm">{message}</div>}
            {error && <div className="p-3 bg-error/10 text-error rounded-md text-sm">{error}</div>}
            
            <Input
              disabled
              type="email"
              label="Email Address (Read-only)"
              value={profile.email}
              className="bg-background-secondary text-text-secondary"
            />
            
            <Input
              required
              type="text"
              label="Full Name"
              icon={User}
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="John Doe"
            />
            
            <Input
              type="text"
              label="Phone Number"
              icon={Phone}
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="+1 (555) 000-0000"
            />
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
