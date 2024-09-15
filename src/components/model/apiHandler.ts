import { Order, SuccessResult, ErrorResult } from '../../types/order';
import { IListAPI, IItemAPI } from '../../types/index';
import { API_URL } from '../../utils/constants';

class OrderAPI {
    constructor(private readonly APIURL: string) {}

    order(order: Order): Promise<SuccessResult | ErrorResult> {
        return fetch(`${this.APIURL}/order`, {
            method: 'POST',
            body: JSON.stringify(order),
        })
        .then(res => {
            return res.json() as Promise<SuccessResult | ErrorResult>;
        });
    }
}

class ProductAPI {
    constructor(private readonly APIURL: string) {}

    getProductList(): Promise<IListAPI> {
        return fetch(`${this.APIURL}/product`)
        .then(res => res.json() as Promise<IListAPI>);
    }

    getProductItem(itemId: string): Promise<IItemAPI> {
        return fetch(`${this.APIURL}/product/${itemId}`)
        .then(res => res.json() as Promise<IItemAPI>);
    }
}

const orderAPI = new OrderAPI(API_URL);
const productAPI = new ProductAPI(API_URL);

export { orderAPI, productAPI };