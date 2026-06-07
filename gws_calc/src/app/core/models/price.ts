export interface Price {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  validFrom: string; // ISO date
}
