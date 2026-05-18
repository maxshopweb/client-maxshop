import { formatCurrencyARS } from "@/app/utils/currency";

/** Paso del slider según el máximo del catálogo (mejor control en rangos altos). */
export function getPriceSliderStep(catalogMax: number): number {
  if (catalogMax <= 20_000) return 100;
  if (catalogMax <= 100_000) return 500;
  if (catalogMax <= 500_000) return 1_000;
  if (catalogMax <= 2_000_000) return 5_000;
  return 10_000;
}

/** Redondea al paso del slider más cercano. */
export function snapPriceToStep(value: number, step: number): number {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
}

export function formatPriceFilterLabel(value: number): string {
  return formatCurrencyARS(value, { fractionDigits: 0, includeSymbol: true });
}

/** Ejemplos numéricos para placeholders (enteros, sin formato). */
export function getPricePlaceholderExamples(
  catalogMin: number,
  catalogMax: number
): { min: string; max: string } {
  const step = getPriceSliderStep(catalogMax);
  const minEx = snapPriceToStep(Math.max(0, catalogMin), step);
  let maxEx = snapPriceToStep(catalogMax, step);
  if (maxEx <= minEx) {
    maxEx = minEx + step;
  }
  return { min: String(minEx), max: String(maxEx) };
}

export function formatPriceFilterRange(
  min: number | undefined,
  max: number | undefined
): string {
  const minLabel = min != null && min > 0 ? formatPriceFilterLabel(min) : formatPriceFilterLabel(0);
  if (max != null && max > 0) {
    return `${minLabel} – ${formatPriceFilterLabel(max)}`;
  }
  if (min != null && min > 0) return minLabel;
  return formatPriceFilterLabel(0);
}
