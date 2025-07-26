"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Logo } from '@/components/icons';
import { ProductUploader } from '@/components/product-uploader';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
            <Logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="text-muted-foreground">Loading Your Dashboard...</p>
        </div>
    </div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
       <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/landing" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">ProductInsight AI</h1>
          </Link>
          <div className="flex items-center gap-4">
             <span className="hidden sm:inline text-sm text-muted-foreground">Welcome, {user.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductUploader />
      </main>
       <footer className="bg-background border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ProductInsight AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
