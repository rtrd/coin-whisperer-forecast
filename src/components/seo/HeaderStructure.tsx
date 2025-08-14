import React from 'react';

interface HeaderStructureProps {
  h1: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h1ClassName?: string;
  h2ClassName?: string;
  h3ClassName?: string;
  h4ClassName?: string;
  showAllHeaders?: boolean;
}

/**
 * HeaderStructure component ensures proper semantic heading hierarchy for SEO
 * Provides consistent H1 > H2 > H3 > H4 structure across the application
 */
export const HeaderStructure: React.FC<HeaderStructureProps> = ({
  h1,
  h2,
  h3,
  h4,
  h1ClassName = "text-3xl md:text-4xl font-bold text-white mb-4",
  h2ClassName = "text-2xl md:text-3xl font-semibold text-white mb-3",
  h3ClassName = "text-xl md:text-2xl font-medium text-white mb-2",
  h4ClassName = "text-lg md:text-xl font-medium text-gray-300 mb-2",
  showAllHeaders = false
}) => {
  return (
    <div className="header-structure">
      <h1 className={h1ClassName}>{h1}</h1>
      
      {(h2 || showAllHeaders) && (
        <h2 className={h2ClassName}>
          {h2 || "Key Features"}
        </h2>
      )}
      
      {(h3 || showAllHeaders) && (
        <h3 className={h3ClassName}>
          {h3 || "Analysis & Insights"}
        </h3>
      )}
      
      {(h4 || showAllHeaders) && (
        <h4 className={h4ClassName}>
          {h4 || "Additional Information"}
        </h4>
      )}
    </div>
  );
};

/**
 * Section header component for content sections
 */
interface SectionHeaderProps {
  level: 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  level,
  children,
  className
}) => {
  const baseClasses = "font-semibold text-white mb-4";
  const levelClasses = {
    2: "text-2xl md:text-3xl",
    3: "text-xl md:text-2xl", 
    4: "text-lg md:text-xl",
    5: "text-base md:text-lg",
    6: "text-sm md:text-base"
  };
  
  const combinedClassName = `${baseClasses} ${levelClasses[level]} ${className || ''}`;
  
  const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return <HeaderTag className={combinedClassName}>{children}</HeaderTag>;
};