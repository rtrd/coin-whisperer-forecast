/**
 * Decodes HTML entities in a string using the browser's built-in parser
 * Handles common entities like &rsquo; ('), &lsquo; ('), &amp; (&), &quot; ("), etc.
 */
export const decodeHtmlEntities = (str: string): string => {
  if (!str) return str;
  
  // Use a temporary textarea element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

/**
 * Safely decodes HTML entities with fallback
 */
export const safeDecodeHtmlEntities = (str: string): string => {
  try {
    return decodeHtmlEntities(str);
  } catch (error) {
    console.warn('Failed to decode HTML entities:', error);
    return str;
  }
};