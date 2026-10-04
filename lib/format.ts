export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProductPrice(value: number, priceOnRequest = false, priceIsEstimate = false) {
  if (priceOnRequest) return "Price to be confirmed";
  return `${priceIsEstimate ? "Est. " : ""}${formatPrice(value)}`;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
