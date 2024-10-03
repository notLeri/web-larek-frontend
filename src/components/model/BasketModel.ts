import { IItemAPI } from '../../types/index';
import { IEvents } from '../../types/index';
import { IBasketModel } from '../../types/model';
import { CatalogModel } from './CatalogModel';

export class BasketModel implements IBasketModel {
    private _items: Map<string, number> = new Map();

    constructor(
        protected events: IEvents,
        private readonly catalogModel: CatalogModel
    ) {}

    public add(id: string): void {
        if (!this._items.has(id)) this._items.set(id, 0);
        this._items.set(id, this._items.get(id) + 1);
        this._changed();
    }

    public remove(id: string): void {
        if (!this._items.has(id)) return;
        if (this._items.get(id)! > 0) {
            this._items.set(id, this._items.get(id) - 1);
            if (this._items.get(id) === 0) this._items.delete(id);
        }
        this._changed();
    }

    protected _changed() {
        this.events.emit('basket:change', { items: Array.from(this._items.keys()) });
    }

    public has(id: string): boolean {
        return this._items.has(id);
    }

    get products(): Map<string, number> {
        return this._items;
    }

    get productsID(): string[] {
        return Array.from(this._items.keys());
    }

    get fullProducts(): Record<string, IItemAPI> {
        const fullProducts: Record<string, IItemAPI> = {};

        for (const [key] of this._items) {
            fullProducts[key] = this.catalogModel.getProduct(key)
        }

        return fullProducts;
    }

    get fullProductsArr(): IItemAPI[] {
        return Object.values(this.fullProducts);
    }

    get price(): number {
        return this.fullProductsArr.reduce((acc, { price }) => {
            return acc + (price === null ? 0 : price);
        }, 0);
    }
}
