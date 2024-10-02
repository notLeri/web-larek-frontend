import { IBasketItem } from './index';
import { IOrderFormPaymentAddress, IOrderFormMailPhone, SuccessResult, ErrorResult, OrderPayment, IOrder } from './order';

export interface IBasket {
    getItems: () => IBasketItem[];
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
}

// export interface IPurchase {
//     purchase: () => Promise<void>;
// }

// export interface IOrder {
//     purchaseList: string[];

//     personalData: { 
//         orderFormPaymentAddress: IOrderFormPaymentAddress,
//         orderFormMailPhone: IOrderFormMailPhone
//     };
// }

export interface IOrderModel {
    addItems: (items: string[], price: number) => void;
    addPayment: (payment: OrderPayment) => void;
    addEmail: (email: string) => void;
    addPhone: (phone: string) => void;
    addAddress: (address: string) => void;
    get order(): IOrder;
    resetOrder: () => void;
}