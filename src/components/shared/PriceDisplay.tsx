import React from "react";
import { formatPrice } from "@/utils/priceCalculations";

interface PriceDisplayProps {
  price: number;
  className?: string;
  showCurrency?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  className = "",
  showCurrency = true,
}) => {
  const formattedPrice = formatPrice(price);
  
  return (
    <span className={className}>
      {showCurrency && "$"}{formattedPrice}
    </span>
  );
};