export type OrderPayment = "online" | "offline";

export interface IOrder {
    payment: OrderPayment,
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
    payment: OrderPayment;
    address: string;
}

export interface IOrderFormMailPhone {
    email: string;
    phone: string;
}