import { IItemAPI, IListAPI, IBasketItem } from './index';
import { IOrderFormPaymentAddress, IOrderFormMailPhone } from './order';

export interface IBasket {
    getItems: () => IBasketItem[];
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
}

export interface IPurchase {
    purchase: () => Promise<void>;
}

export interface IOrder {
    purchaseList: string[];

    personalData: { 
        orderFormPaymentAddress: IOrderFormPaymentAddress,
        orderFormMailPhone: IOrderFormMailPhone
    };
}