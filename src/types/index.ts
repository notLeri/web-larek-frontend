interface IItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface IListAPI {
    total: number;
    items: IItemAPI[];
}

interface IBasketModel {
    items: Map<string, number>
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
}

interface IBasketItem {
    title: string;
    price: number;
}

// const item: IItemAPI = {};
// const basketItem: IBasketItem = item as IBasketItem;

interface ICatalog {
    items: IItemAPI[];
    initItems: (items: IItemAPI[]) => void
    getItem: (id: string) => IItemAPI | null
}


interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

interface IProduct {
    id: string;
    title: string;
}

interface CatalogModel {
    items: IItemAPI[];
    getItems: () => Promise<IListAPI>;
    // setItems: (items: IItemAPI[]) => void;
    // getProduct(id: string): IProduct;
}

interface IOrderForm1 {
    payment: 'online' | 'offline';
    address: string;
}

interface IOrderForm2 {
    email: string;
    phone: number;
}