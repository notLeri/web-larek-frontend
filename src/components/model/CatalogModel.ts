import { IItemAPI, ICatalogModel, IEvents } from '../../types/index';

export class CatalogModel implements ICatalogModel {
    public items: IItemAPI[];

    constructor(protected events: IEvents) {}

    setItems(items: IItemAPI[]): void {
        this.items = items;
    }

    getProduct(id: string): IItemAPI | null {
        return this.items.find(item => item.id === id) || null;
    }
}
