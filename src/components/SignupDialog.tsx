import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export const SignupDialog: React.FC<SignupDialogProps> = ({
  open,
  onOpenChange,
  title,
  description
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Thanks for signing up! You now have access to premium features.",
      });
      
      // Store signup status
      localStorage.setItem('user_unlocked', 'true');
      
      onOpenChange(false);
      
      // Refresh the page to show unlocked content
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            {description}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Get Free Access'}
            </Button>
          </form>
          
          <p className="text-xs text-gray-400 text-center">
            Free access • No credit card required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};