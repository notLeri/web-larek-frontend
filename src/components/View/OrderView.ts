import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IOrder {

}

export class Order extends Component<IOrder> {
    private _cardOnlineBtnElement: HTMLButtonElement;
    private _cashOfflineBtnElement: HTMLButtonElement;
    private _addressInputElement: HTMLInputElement;
    private _formSubmitButtonElement: HTMLButtonElement;
    private _formErrorsElement: HTMLSpanElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this._cardOnlineBtnElement = ensureElement<HTMLButtonElement>('[name=card]', this.container);
        this._cashOfflineBtnElement = ensureElement<HTMLButtonElement>('[name=cash]', this.container);
        this._addressInputElement = ensureElement<HTMLInputElement>('[name=address]', this.container);
        this._formSubmitButtonElement = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this._formErrorsElement = ensureElement<HTMLSpanElement>('.form__errors', this.container);

        // this._addressInputElement = this._formOrderElement.querySelector('.form__input[name=address]');
        // this._formSubmitButtonElement = this._formOrderElement.querySelector('.order__button');
        // this._formErrorsElement = this._formOrderElement.querySelector('.form__errors');
        // this.contentContainer.textContent = '';
        // this.contentContainer.appendChild(this._formOrderElement);

        // this._cardOnlineBtnElement.addEventListener('click', () => this._changePaymentMethod('online'));
        // this._cashOfflineBtnElement.addEventListener('click', () => this._changePaymentMethod('offline'));
        // this._addressInputElement.addEventListener('input', this._changeAddress);
        // this._formOrderElement.addEventListener('submit', this._submitForm);

        this._validateForm();
    }

    private _changeAddress = (): void => {
        this.orderModel.addAddress(this._addressInputElement.value);
        this._validateForm();
    }

    private _changePaymentMethod(payment: OrderPayment): void {
        this.orderModel.addPayment(payment);
        
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
        
        this._formSubmitButtonElement.disabled = !validPayment || !validAddress;
    }
    
    private _validateForm(): void {
        const { validPayment, validAddress } = this._getValidForm();

        const errorPaymentText = 'Необходимо выбрать статус оплаты';
        const errorAdressText = 'Необходимо указать адрес';
        
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