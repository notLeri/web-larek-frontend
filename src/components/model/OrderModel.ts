import { IOrder, OrderPayment } from "../../types/order";
import { IOrderModel } from "../../types/model";

export class OrderModel implements IOrderModel {
    private items: string[];
    private totalPrice: number = 0;
    private payment: OrderPayment | null = null;
    private email: string | null = null;
    private phone: string | null = null;
    private address: string | null = null;

    constructor() {}

    public addItems(itemIDs: string[], price: number): void {
        this.items = itemIDs;
        this.totalPrice = price;
        this._changed();
    }

    public addPayment(payment: OrderPayment): void {
        this.payment = payment;
        this._changed();
    }

    public addAddress(address: string): void {
        this.address = address;
        this._changed();
    }

    public addEmail(email: string): void {
        this.email = email;
        this._changed();
    }

    public addPhone(phone: string): void {
        this.phone = phone;
        this._changed();
    }

    get order(): IOrder {
        return { payment: this.payment, address: this.address, email: this.email, phone: this.phone, total: this.totalPrice, items: this.items }
    }

    get price(): number {
        return this.totalPrice;
    }

    public getValidOrder(): boolean {
        return this.payment !== null
            && this.email !== null
            && this.phone !== null
            && this.address !== null;
    }

    public resetOrder(): void {
        this.payment = null;
        this.email = null;
        this.phone = null;
        this.address = null;
        this.items = [];
        this.totalPrice = 0;

        this._changed();
    }

    private _changed() {
        // console.log(JSON.parse(JSON.stringify(this)));
    }
}