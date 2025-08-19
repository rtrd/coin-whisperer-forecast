
import React from "react";
import { IndexHeader } from "@/components/IndexHeader";
import { MainNavigation } from "@/components/MainNavigation";
import Footer from "@/components/Footer";

interface BlogLayoutProps {
  children: React.ReactNode;
  cryptoOptions: any[];
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, cryptoOptions }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={45000}
          priceChange={2.5}
        />
      </div>

      {/* Navigation */}
      <MainNavigation />

      <div className="container mx-auto px-4 pb-8">
        {children}
      </div>

      <Footer />
    </div>
  );
};
