import { IItemAPI, IEvents } from '../../types/index';
import { ICatalogModel } from '../../types/model';

export class CatalogModel implements ICatalogModel {
    private _items: IItemAPI[];

    constructor(protected events: IEvents) {}

    get items(): IItemAPI[] {
        return this._items;
    }

    public setItems(items: IItemAPI[]): void {
        this._items = items;
    }

    public getProduct(id: string): IItemAPI | null {
        return this._items.find(_item => _item.id === id) || null;
    }
}
