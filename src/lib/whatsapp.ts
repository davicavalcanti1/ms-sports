export const VENDORS = {
  rafael: { name: "Rafael", number: "5583981109166" },
  joaoVictor: { name: "João Victor", number: "5583998168765" },
};

/**
 * Returns one of the two vendors with 50/50 probability.
 * Session-stable: same vendor is used throughout a single page load.
 */
let _sessionVendor: typeof VENDORS[keyof typeof VENDORS] | null = null;

export function getVendor(): typeof VENDORS[keyof typeof VENDORS] {
  if (!_sessionVendor) {
    _sessionVendor = Math.random() < 0.5 ? VENDORS.rafael : VENDORS.joaoVictor;
  }
  return _sessionVendor;
}

export function buildWhatsappUrl(message: string): string {
  const vendor = getVendor();
  return `https://wa.me/${vendor.number}?text=${encodeURIComponent(message)}`;
}

export function buildVendorUrl(
  vendor: typeof VENDORS[keyof typeof VENDORS],
  message: string
): string {
  return `https://wa.me/${vendor.number}?text=${encodeURIComponent(message)}`;
}
