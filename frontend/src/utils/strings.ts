export const asRuNumber = (v: number | string) =>
  Number(v).toLocaleString("ru-RU", { maximumFractionDigits: 2 });

export const withCurrency = (v: number | string, currency: string) =>
  Number(v).toLocaleString("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
