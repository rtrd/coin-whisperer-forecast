
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sparkles, Zap } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({
  title,
  description,
  icon
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-600/50 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
            {icon || <Sparkles className="h-8 w-8 text-white" />}
          </div>
        </div>
        <CardTitle className="text-white text-xl">{title}</CardTitle>
        {description && (
          <p className="text-gray-200 text-sm mt-2">{description}</p>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-purple-300" />
          <span className="text-purple-200 font-semibold">COMING SOON</span>
        </div>
        <p className="text-gray-200 text-sm">
          We're working hard to bring you the most advanced AI-powered cryptocurrency analysis tools. 
          Stay tuned for exciting updates!
        </p>
        <div className="mt-6 flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </CardContent>
    </Card>
  );
};
