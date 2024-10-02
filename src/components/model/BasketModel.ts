import { IBasketModel, IItemAPI } from '../../types/index';
import { IEvents } from '../../types/index';
import { CatalogModel } from './CatalogModel';

export class BasketModel implements IBasketModel {
    private items: Map<string, number> = new Map();

    constructor(
        protected events: IEvents,
        private readonly catalogModel: CatalogModel
    ) {}

    public add(id: string): void {
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id) + 1);
        this._changed();
    }

    public remove(id: string): void {
        if (!this.items.has(id)) return;
        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id) - 1);
            if (this.items.get(id) === 0) this.items.delete(id);
        }
        this._changed();
    }

    protected _changed() {
        this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
    }

    public has(id: string): boolean {
        return this.items.has(id);
    }

    get products(): Map<string, number> {
        return this.items;
    }

    get productsID(): string[] {
        return Array.from(this.items.keys());
    }

    get fullProducts(): Record<string, IItemAPI> {
        const fullProducts: Record<string, IItemAPI> = {};

        for (const [key] of this.items) {
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
