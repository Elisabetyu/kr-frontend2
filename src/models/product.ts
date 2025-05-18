export interface Product {
    id: number;
    name: string;
    description?: string;
    cost: number;
    icon?: string; // Будет приходить как base64 строка
}

export interface ProductCreate {
    name: string;
    description?: string;
    cost: number;
    icon?: string;
}