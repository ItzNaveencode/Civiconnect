
"use client"; // Make this a client component to use hooks

import Image from 'next/image';
import { mockUsers } from '@/lib/mockData';
import type { UserProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Edit3, LogOut, Settings, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Simulate fetching current user profile (remains an async function if called server-side, but here it's illustrative)
async function getCurrentUserProfile(): Promise<UserProfile | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const currentUser = mockUsers.find(u => u.id === 'user1'); 
  return currentUser || null; 
}

export default function ProfilePage() {
  const { logout } = useAuth(); // Get logout function from context
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userProfile = await getCurrentUserProfile();
      setUser(userProfile);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // AppStructureClient will handle redirecting to /verify/phone
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-muted-foreground">User not found.</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center space-x-4">
        <Avatar className="h-20 w-20 border-2 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.imageAiHint || "profile photo"} />
          <AvatarFallback className="text-2xl bg-muted">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Manage your account information and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <p><strong>Points:</strong> {user.points}</p>
                <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <Separator />
            <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">Badges Earned</h3>
                {user.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="py-1 px-3 text-sm">
                        <badge.icon className="h-4 w-4 mr-1.5 text-accent" />
                        {badge.name}
                    </Badge>
                    ))}
                </div>
                ) : (
                <p className="text-sm text-muted-foreground">No badges earned yet. Keep contributing!</p>
                )}
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="mr-2 h-4 w-4" /> Account Settings
            </Button>
             <Button variant="destructive" className="w-full sm:w-auto sm:ml-auto" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Overview of your contributions to the community.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Issues Reported</p>
                <p className="text-2xl font-semibold">{user.issuesReported}</p>
            </div>
             <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Issues Verified</p>
                <p className="text-2xl font-semibold">{user.issuesVerified}</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}

