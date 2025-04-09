import { AssetItem } from "@/models/asset";

export const calculateDaysUsed = (purchaseDate: string): number => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - purchase.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateDailyCost = (price: number, daysUsed: number): number => {
    return daysUsed > 0 ? price / daysUsed : 0;
};

export const formatServiceTime = (days: number): string => {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    if (years > 0) {
        return `${years}年${remainingDays}天`;
    }
    return `${days}天`;
};

export const formatCurrency = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
}

export const enrichAssetItem = (item: AssetItem): AssetItem => {
    const daysUsed = calculateDaysUsed(item.purchaseDate);
    const dailyCost = calculateDailyCost(item.price, daysUsed);
    return {
        ...item,
        daysUsed,
        dailyCost
    };
}