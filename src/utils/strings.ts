export const stripHtmlTags = (input: string): string => {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
};

export const shortenWalletAddress = (address: string, n = 5, m = 5) => {
  if (!address || address.length <= n + m) {
    return address;
  }
  return `${address.slice(0, n)}...${address.slice(-m)}`;
};

export const truncateString = (str: string, maxLength = 50) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
};
