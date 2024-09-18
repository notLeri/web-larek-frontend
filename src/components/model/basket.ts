import { IItemAPI, IListAPI, IBasket, IBasketItem } from '../../types/index';
import { AppApi } from './AppApi';
import { catalog } from './Catalog'

class Basket implements IBasket {
    constructor(
        private basketItems: IBasketItem[] = []
    ) {}

    getItems(): IBasketItem[] {
        return this.basketItems;
    }

    add(id: string): void {
        const product = catalog.getAll().find(item => item.id === id);
        if (!product) {
            this.basketItems.push(product);
        }
    }

    remove(id: string): void {
        const product = this.basketItems.find(item => item.id === id);
        if (product) {
            this.basketItems.filter(basketItem => basketItem.id !== id);
        }
    }
}

const basket = new Basket();

export { basket };