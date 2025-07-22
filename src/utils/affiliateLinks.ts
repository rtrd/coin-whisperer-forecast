// Utility for generating eToro affiliate links
export const generateEtoroAffiliateUrl = (tokenSymbol: string): string => {
  const symbol = tokenSymbol.toLowerCase();
  return `https://www.etoro.com/markets/${symbol}?utm_medium=Affiliate&utm_source=126447&utm_content=0&utm_serial=CHANGE&utm_campaign=CHANGE&utm_term=`;
};

// Function to open affiliate link in new tab
export const openAffiliateLink = (tokenSymbol: string): void => {
  const url = generateEtoroAffiliateUrl(tokenSymbol);
  window.open(url, '_blank');
};