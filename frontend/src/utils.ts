export const currencyToSymbol = (currency: string) => {
  if (currency == "usd") return "$";
  if (currency == "rub") return "₽";
  if (currency == "eur") return "€";
};
