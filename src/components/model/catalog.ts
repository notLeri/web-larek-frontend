import { IItemAPI, IListAPI, ICatalogModel } from '../../types/index';
import { AppApi } from './AppApi';

class CatalogModel implements ICatalogModel {
    constructor(private items: IItemAPI[] = []) {}

    getAll(): IItemAPI[] {
        return this.items;
    }

    getItem(id: string): IItemAPI | null {
        return this.items.find(item => item.id === id) || null;
    }

    updateState(): Promise<void> {
        return AppApi.getProductList().then((list: IListAPI) => {
            this.items = list.items;
        });
    }
}

const catalog = new CatalogModel();

export { catalog };