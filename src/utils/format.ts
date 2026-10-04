/**
 * Formats monetary amounts with the currency symbol.
 * Formats negative values as "-₹1,800" rather than "₹-1,800".
 */
export const formatMoney = (amount: number, currency: string = '₹'): string => {
  if (isNaN(amount)) return `${currency}0`;
  if (amount < 0) {
    return `-${currency}${Math.abs(amount).toLocaleString()}`;
  }
  return `${currency}${amount.toLocaleString()}`;
};
