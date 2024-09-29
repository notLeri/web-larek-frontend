export interface IListAPI {
    total: number;
    items: IItemAPI[];
}

export interface IItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: TCategory;
    price: number | null;
}

export type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface ICatalogModel {
    items: IItemAPI[];
    setItems(items: IItemAPI[]): void;
    getProduct(id: string): IItemAPI | null;
}

export interface ICatalogItem {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasketModel<T = string> {
    add(item: T): void;
    remove(item: T): void;
    has(item: T): boolean;
    get products(): Map<string, number>;
}

export interface IBasketItem {
    id: string;
    title: string;
    price: number;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IView {
    render(data?: object): HTMLElement;
}