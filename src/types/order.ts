export interface Order {
    payment: "online" | "offline",
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export type SuccessResult =  {
    id: string,
    total: number
}

export type ErrorResult = {
    error: string
}

export interface IOrderFormPaymentAddress {
    payment: 'online' | 'offline';
    address: string;
}

export interface IOrderFormMailPhone {
    email: string;
    phone: string;
}