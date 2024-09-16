import { IItemAPI, IListAPI, IBasket, IBasketItem } from '../../types/index';
import { productAPI } from './apiHandler';

class Basket implements IBasket {
    constructor(
        private items: IItemAPI[] = [], 
        private basketItems: IBasketItem[] = []
    ) {}

    getItems(): IBasketItem[] {
        return this.basketItems;
    }

    add(id: string): void {
        const product = this.items.find(item => item.id === id);
        if (!product) {
            this.basketItems.push(product);
        }
    }

    remove(id: string): void {
        const product = this.items.find(item => item.id === id);
        if (product) {
            this.basketItems.filter(basketItem => basketItem.id !== id);
        }
    }

    updateState(): Promise<void> {
        return productAPI.getProductList().then((list: IListAPI) => {
            this.items = list.items;
        });
    }
}

const basket = new Basket();

export { basket };