import { OrderPayment } from "../../types/order";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Form } from "../base/Form";
import { OrderModel } from "../model/OrderModel";

export class Order extends Form {
    private _cardOnlineBtnElement: HTMLButtonElement;
    private _cashOfflineBtnElement: HTMLButtonElement;
    private _addressInputElement: HTMLInputElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private _orderModel: OrderModel
    ) {
        super(container, events);

        this._cardOnlineBtnElement = ensureElement<HTMLButtonElement>('[name=card]', this.container);
        this._cashOfflineBtnElement = ensureElement<HTMLButtonElement>('[name=cash]', this.container);
        this._addressInputElement = ensureElement<HTMLInputElement>('[name=address]', this.container);

        this._cardOnlineBtnElement.addEventListener('click', () => this._changePaymentMethod('online'));
        this._cashOfflineBtnElement.addEventListener('click', () => this._changePaymentMethod('offline'));
        this._addressInputElement.addEventListener('input', this._changeAddress);
        this.container.addEventListener('submit', this._submitForm);

        this._validateForm();
    }

    public resetInputs(): void {
        if (this._cardOnlineBtnElement.classList.contains('button_alt-active')) {
            this._cardOnlineBtnElement.classList.remove('button_alt-active');
        }
        if (this._cashOfflineBtnElement.classList.contains('button_alt-active')) {
            this._cashOfflineBtnElement.classList.remove('button_alt-active');
        }
        this._addressInputElement.value = '';
        
        this.setDisabled(this._formSubmitButtonElement, true);
    }

    private _changeAddress = (): void => {
        this._orderModel.addAddress(this._addressInputElement.value);
        this._validateForm();
    }

    private _changePaymentMethod(payment: OrderPayment): void {
        this._orderModel.addPayment(payment);
        
        if (payment === 'online') {
            this._cardOnlineBtnElement.classList.add('button_alt-active');
            this._cashOfflineBtnElement.classList.remove('button_alt-active');
        } else if (payment === 'offline') {
            this._cardOnlineBtnElement.classList.remove('button_alt-active');
            this._cashOfflineBtnElement.classList.add('button_alt-active');
        }

        this._validateForm();
    }
    
    private _renderDisableStatusButton(): void {
        const { validPayment, validAddress } = this._getValidForm();

        this.setDisabled(this._formSubmitButtonElement, !validPayment || !validAddress);
    }
    
    private _validateForm(): void {
        const { validPayment, validAddress } = this._getValidForm();

        const errorPaymentText = '-> Необходимо выбрать статус оплаты';
        const errorAdressText = '-> Необходимо указать адрес';
        
        this._formErrorsElement.innerHTML = `
        ${!validPayment ? errorPaymentText : ''}
        ${(!validPayment && !validAddress) ? '<br>' : ''}
        ${!validAddress ? errorAdressText : ''}
        `;

        this._renderDisableStatusButton();
    }

    private _getValidForm(): { validPayment: boolean, validAddress: boolean } {
        const validPayment = (
            this._cardOnlineBtnElement.classList.contains('button_alt-active') ||
            this._cashOfflineBtnElement.classList.contains('button_alt-active')
        );
        const validAddress = this._addressInputElement.value !== '';
        
        return { validPayment, validAddress };
    }

    private _submitForm = (event: Event): void => {
        event.preventDefault();
        this.events.emit('modalContacts:open');
    }
}