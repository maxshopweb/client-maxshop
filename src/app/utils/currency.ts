interface FormatCurrencyOptions {
  includeSymbol?: boolean;
  symbol?: string;
  fractionDigits?: number;
}

/**
 * Formats a value using Argentine locale with optional currency symbol.
 */
export function formatCurrencyARS(
  value: number | string | null | undefined,
  options?: FormatCurrencyOptions
): string {
  const { includeSymbol = true, symbol = "$", fractionDigits = 2 } = options ?? {};

  const numericValue =
    typeof value === "string" ? Number(value) : value ?? 0;

  if (!Number.isFinite(numericValue)) {
    return includeSymbol ? `${symbol}0,00` : "0,00";
  }

  const absoluteValue = Math.abs(numericValue);
  const formatted = absoluteValue.toLocaleString("es-AR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  const sign = numericValue < 0 ? "-" : "";

  return includeSymbol ? `${sign}${symbol}${formatted}` : `${sign}${formatted}`;
}
