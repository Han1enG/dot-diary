export interface AnniversaryItem {
    id: string;
    title: string;
    date: string;
    days: number;
    weekday: string;
    color: string;
    isCompleted?: boolean;
    icon?: string;
}