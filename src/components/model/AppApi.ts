import { Order, SuccessResult, ErrorResult } from '../../types/order';
import { IListAPI, IItemAPI, IApi } from '../../types/index';

// class AppApi {
//     readonly _baseApi: IApi;

//     constructor(private readonly APIURL: string) {
//     }

//     getProductList(): Promise<IListAPI> {
//         return fetch(`${this.APIURL}/product`)
//         .then(res => res.json() as Promise<IListAPI>);
//     }

//     getProductItem(itemId: string): Promise<IItemAPI> {
//         return fetch(`${this.APIURL}/product/${itemId}`)
//         .then(res => res.json() as Promise<IItemAPI>);
//     }

//     order(order: Order): Promise<SuccessResult | ErrorResult> {
//         return fetch(`${this.APIURL}/order`, {
//             method: 'POST',
//             body: JSON.stringify(order),
//         })
//         .then(res => {
//             return res.json() as Promise<SuccessResult | ErrorResult>;
//         });
//     }
// }

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

    getProductList(): Promise<IListAPI> {
        return this._baseApi.get<IListAPI>(`/product`);
    }

    getProductItem(itemId: string): Promise<IItemAPI> {
        return this._baseApi.get<IItemAPI>(`/product/${itemId}`);
    }

    order(order: Order): Promise<SuccessResult | ErrorResult> {
        return this._baseApi.post<SuccessResult | ErrorResult>(`/order`, order);
    }
}
