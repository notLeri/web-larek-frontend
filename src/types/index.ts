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
    updateState(): Promise<void>;
}

export interface IBasketItem {
    id: string;
    title: string;
    price: number;
}
