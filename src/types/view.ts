import { IItemAPI } from "./index";

export interface ICatalogItemView {
    item: IItemAPI;
}

export interface IProductPreview {
    data: IItemAPI;
}

export interface IBasket {
    list: IItemAPI[];
    price: number;
}

export interface IBasketItemView {
    id: string;
    index: number;
    title: string;
    price: string;
}

export interface IForm {
    resetInputs(): void;
}

export interface IConfirmSuccess {
    price: number;
}