export function displayCurrency(value: number, currency: 'bolivares' | 'dolars') {
  if (currency === 'bolivares') {
    return displayBS(value);
  }
  return displayDS(value);
}

export function displayBS(value: number) {
  return Math.round(value / 1000 * 37);
}

export function displayDS(value: number) {
  return value / 1000;
}

export function currencyToText(currency: string): 'bolivares' | 'dolares' {
  return currency === 'bolivares' ? currency : 'dolares'
}

export function displayPaymentMethod(method: 'cash' | 'transfer'): 'efectivo' | 'transferencia' {
  if (method === 'cash') {
    return 'efectivo';
  }
  return 'transferencia';
}
