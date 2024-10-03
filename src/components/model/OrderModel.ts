import { IOrder, OrderPayment } from "../../types/order";
import { IOrderModel } from "../../types/model";

export class OrderModel implements IOrderModel {
    private _items: string[];
    private _totalPrice: number = 0;
    private _payment: OrderPayment | null = null;
    private _email: string | null = null;
    private _phone: string | null = null;
    private _address: string | null = null;

    constructor() {}

    public addItems(itemIDs: string[], price: number): void {
        this._items = itemIDs;
        this._totalPrice = price;
        this._changed();
    }

    public addPayment(payment: OrderPayment): void {
        this._payment = payment;
        this._changed();
    }

    public addAddress(address: string): void {
        this._address = address;
        this._changed();
    }

    public addEmail(email: string): void {
        this._email = email;
        this._changed();
    }

    public addPhone(phone: string): void {
        this._phone = phone;
        this._changed();
    }

    get order(): IOrder {
        return { payment: this._payment, address: this._address, email: this._email, phone: this._phone, total: this._totalPrice, items: this._items }
    }

    get price(): number {
        return this._totalPrice;
    }

    public getValidOrder(): boolean {
        return this._payment !== null
            && this._email !== null
            && this._phone !== null
            && this._address !== null;
    }

    public resetOrder(): void {
        this._payment = null;
        this._email = null;
        this._phone = null;
        this._address = null;
        this._items = [];
        this._totalPrice = 0;

        this._changed();
    }

    private _changed() {
        // console.log(JSON.parse(JSON.stringify(this)));
    }
}