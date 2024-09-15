import { IItemAPI, IListAPI, IBasket, IBasketItem } from '../../types/index';
import { productAPI } from './apiHandler';

class Basket implements IBasket {
    constructor(private items: IItemAPI[] = []) {}

    getItems(): IBasketItem[] {

    }

    add(id: string): void {

    }

    remove(id: string): void {

    }

    updateState(): Promise<void> {
        return productAPI.getProductList().then((list: IListAPI) => {
            this.items = list.items;
        });
    }
}

const basket = new Basket();

export { basket };