export interface AssetItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    daysUsed: number;
    dailyCost: number;
    purchaseDate: string;
    isRetired?: boolean;
  }