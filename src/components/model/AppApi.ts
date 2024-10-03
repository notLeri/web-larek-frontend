import { IOrder, SuccessResult, ErrorResult } from '../../types/order';
import { IListAPI, IItemAPI, IApi } from '../../types/index';

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

    order(order: IOrder): Promise<SuccessResult | ErrorResult> {
        return this._baseApi.post<SuccessResult | ErrorResult>(`/order`, order);
    }
}
