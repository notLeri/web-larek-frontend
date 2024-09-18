export interface IListAPI {
    total: number;
    items: IItemAPI[];
}

export interface IItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICatalog {

}

export interface ICatalogModel {
    getAll(): IItemAPI[];
    getItem: (id: string) => IItemAPI | null;
    updateState(): Promise<void>;
}

export interface ICatalogItem {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasket {
    getItems(): IBasketItem[];
    add(id: string): void;
    remove(id: string): void;
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