import { IBasketModel } from '../../types/index';
import { IEvents } from '../../types/index';

export class BasketModel implements IBasketModel {
    private items: Map<string, number> = new Map();

    constructor(protected events: IEvents) {}

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
        return this.items
    }
}
