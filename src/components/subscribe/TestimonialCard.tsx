import React from 'react';
import { Star, User } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  rating: number;
  profit: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  testimonial,
  rating,
  profit
}) => {
  return (
    <div className="bg-glass-bg backdrop-blur-sm border border-glass-border rounded-xl p-6 transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-premium to-premium-end rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
        <div className="ml-auto bg-crypto-success/20 text-crypto-success px-3 py-1 rounded-full text-sm font-bold">
          {profit}
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-crypto-gold fill-current' : 'text-gray-600'}`} 
          />
        ))}
      </div>
      
      <p className="text-gray-300 text-sm italic">"{testimonial}"</p>
    </div>
  );
};