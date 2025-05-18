// [file name]: cart.ts
export interface CartItem {
    id: number;
    product_id: number;
    amount: number;
    user_id: number;
    name: string;
    cost: number;
    icon?: string;
}

export interface CartUpdateRequest {
    product_id: number;
    amount: number;
}