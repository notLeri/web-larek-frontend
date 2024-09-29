import { OrderPayment } from "../../types/order";

export class OrderModel {
    private payment: OrderPayment | null = null;
    private email: string | null = null;
    private phone: string | null = null;
    private address: string | null = null;

    constructor() {

    }

    public addPayment(payment: OrderPayment): void {
        this.payment = payment;
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

    public addAddress(address: string): void {
        this.address = address;
        this._changed();
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

        this._changed();
    }

    private _changed() {
        // console.log(JSON.parse(JSON.stringify(this)));
    }
}