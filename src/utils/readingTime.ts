// Reading time calculation utility

export const calculateReadingTime = (content: string): string => {
  if (!content) return '1 min read';
  
  // Remove HTML tags and decode entities
  const plainText = content
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Replace HTML entities with space
    .trim();
  
  // Count words (split by whitespace and filter empty strings)
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Average reading speed: 200-250 words per minute
  // Using 225 as a middle ground
  const averageWPM = 225;
  const readingTimeMinutes = Math.ceil(wordCount / averageWPM);
  
  // Minimum 1 minute, maximum 60 minutes for display
  const clampedTime = Math.max(1, Math.min(60, readingTimeMinutes));
  
  return `${clampedTime} min read`;
};

export const calculateReadingTimeDetailed = (content: string): {
  wordCount: number;
  readingTime: string;
  readingTimeMinutes: number;
} => {
  if (!content) {
    return {
      wordCount: 0,
      readingTime: '1 min read',
      readingTimeMinutes: 1
    };
  }
  
  const plainText = content
    .replace(/<[^>]+>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim();
  
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 225);
  const clampedTime = Math.max(1, Math.min(60, readingTimeMinutes));
  
  return {
    wordCount,
    readingTime: `${clampedTime} min read`,
    readingTimeMinutes: clampedTime
  };
};