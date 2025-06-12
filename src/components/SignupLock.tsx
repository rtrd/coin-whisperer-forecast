
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Mail, Crown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SignupLockProps {
  children: React.ReactNode;
  title: string;
  description: string;
  skeletonData?: React.ReactNode;
}

export const SignupLock: React.FC<SignupLockProps> = ({
  children,
  title,
  description,
  skeletonData
}) => {
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('ai-content-unlocked') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Unlock content
    localStorage.setItem('ai-content-unlocked', 'true');
    setIsUnlocked(true);
    setIsLoading(false);
    
    toast.success("Email sent! AI content unlocked successfully!");
    setEmail('');
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred background content with rounded edges */}
      <div className="blur-sm pointer-events-none select-none rounded-lg overflow-hidden">
        {skeletonData || children}
      </div>
      
      {/* Overlay with signup form - dark glow instead of white */}
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg shadow-2xl shadow-black/50">
        <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-6 w-6 text-yellow-400" />
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                PREMIUM
              </Badge>
            </div>
            <CardTitle className="text-white text-xl">{title}</CardTitle>
            <p className="text-gray-300 text-sm">{description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email to unlock"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Email...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Unlock AI Analysis
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-green-300 text-sm">
                <Check className="h-4 w-4" />
                <span>Free access • No subscription required</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
