import { IItemAPI } from "./index";

export interface IModal {
    content: HTMLElement;
    open(ApiItem?: IItemAPI): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
    isOpen(): boolean;
    render(data?: Partial<IModal>): HTMLElement;
}

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