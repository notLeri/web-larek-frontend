import { IItemAPI, IListAPI, ICatalog } from '../../types/index';
import { productAPI } from './apiHandler';

class Catalog implements ICatalog {
    constructor(private items: IItemAPI[] = []) {}

    getAll(): IItemAPI[] {
        return this.items;
    }

    getItem(id: string): IItemAPI | null {
        return this.items.find(item => item.id === id) || null;
    }

    updateState(): Promise<void> {
        return productAPI.getProductList().then((list: IListAPI) => {
            this.items = list.items;
        });
    }
}

const catalog = new Catalog();

export { catalog };