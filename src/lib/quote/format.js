// Money formatting for quotes. Client-safe.
// display "symbol" for screens/emails ("KES 36,000", "€1,200", "CA$900");
// "code" for the PDF, whose standard fonts can't draw symbols like ₦ or ₹ ("NGN 120,000").
export const formatMoney = (amount, currency = "USD", display = "symbol") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: display, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(amount);
