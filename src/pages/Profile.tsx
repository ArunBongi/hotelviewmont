import { useState, useEffect } from 'react';
import { getCurrentUser, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('No user found');
      }

      console.log('Current user:', user);

      // First, try to get the existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Fetch profile result:', { existingProfile, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        setProfile({
          id: user.id,
          email: user.email || '',
          name: existingProfile.name || '',
          phone: existingProfile.phone || '',
          avatar_url: existingProfile.avatar_url,
          created_at: existingProfile.created_at,
          updated_at: existingProfile.updated_at,
        });
      } else {
        // Create a new profile if it doesn't exist
        const newProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          name: '',
          phone: '',
          avatar_url: null,
        };

        console.log('Creating new profile:', newProfile);

        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            name: '',
            phone: '',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        console.log('Insert profile result:', { insertData, insertError });

        if (insertError) throw insertError;
        setProfile(newProfile);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load profile. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      console.log('Updating profile:', profile);

      // Update the profile in the database
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      console.log('Update profile result:', { updateData, updateError });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Update local state with the returned data
      if (updateData) {
        setProfile(prev => prev ? {
          ...prev,
          ...updateData,
        } : null);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile?.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile?.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving} 
                  className="w-full bg-[#722F37] hover:bg-[#722F37]/90 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
} 