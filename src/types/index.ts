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

export interface ICatalogItem {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasketItem {
    id: string;
    title: string;
    price: number;
}

export interface IModal {
    open(ApiItem?: IItemAPI): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
}

export interface IBasket {
    getItems: () => IBasketItem[];
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
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