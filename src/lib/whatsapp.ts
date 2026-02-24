const WHATSAPP_NUMBERS = [
  "5583998168765",
  "5583996476131",
];

/**
 * Returns one of the two WhatsApp numbers with 50/50 probability.
 * Uses a persistent random value per page load so the same number
 * is used throughout a single session.
 */
let _sessionNumber: string | null = null;

export function getWhatsappNumber(): string {
  if (!_sessionNumber) {
    _sessionNumber = WHATSAPP_NUMBERS[Math.random() < 0.5 ? 0 : 1];
  }
  return _sessionNumber;
}

export function buildWhatsappUrl(message: string): string {
  const number = getWhatsappNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
