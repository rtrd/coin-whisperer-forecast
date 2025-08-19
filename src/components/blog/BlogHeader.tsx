
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BlogHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Crypto Blog</h1>
      </div>
    </div>
  );
};
