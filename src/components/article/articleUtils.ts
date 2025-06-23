
export const getPreviewText = (
  article: { excerpt?: string; content?: string },
  variant: "default" | "blog",
  compact: boolean = false,
  highlighted: boolean = false,
  horizontal: boolean = false
): string => {
  if (variant === "default") return article.excerpt || "";
  
  const text = article.excerpt || article.content || "";
  const cleanText = text.replace(/<[^>]+>/g, "").trim();
  const words = cleanText.split(" ");
  let wordLimit = 25;
  
  if (compact) wordLimit = 15;
  if (highlighted) wordLimit = 80; // Increased from 50 to 80 for more description
  if (horizontal) wordLimit = 12;
  
  return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
};
