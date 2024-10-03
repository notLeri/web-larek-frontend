import { IItemAPI } from './index';
import { OrderPayment, IOrder } from './order';

export interface ICatalogModel {
    items: IItemAPI[];
    setItems(items: IItemAPI[]): void;
    getProduct(id: string): IItemAPI | null;
}

export interface IBasketModel<T = string> {
    add(item: T): void;
    remove(item: T): void;
    has(item: T): boolean;
    get products(): Map<string, number>;
}

export interface IOrderModel {
    addItems: (items: string[], price: number) => void;
    addPayment: (payment: OrderPayment) => void;
    addEmail: (email: string) => void;
    addPhone: (phone: string) => void;
    addAddress: (address: string) => void;
    get order(): IOrder;
    resetOrder: () => void;
}