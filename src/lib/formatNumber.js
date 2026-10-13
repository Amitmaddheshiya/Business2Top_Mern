/**
 * Format large numbers with k, M, B, T suffixes
 * @param {number} num - The number to format
 * @returns {string} - Formatted number with suffix
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  }
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}
