import { cloneTemplate } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Modal } from "../common/Modal";
import { OrderModel } from "../model/OrderModel";

export class ModalContacts extends Modal {
    private _formContactsElement: HTMLFormElement;
    private _formInputEmailElement: HTMLInputElement;
    private _formInputPhoneElement: HTMLInputElement;
    private _formSubmitButtonElement: HTMLButtonElement;
    private _formErrorsElement: HTMLSpanElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private readonly orderModel: OrderModel
    ) {
        super(container, events);
    }

    override open(): void {
        this._render();
        super.open();
    }
    
    override close(): void {
        this.orderModel.resetOrder();
        super.close();
    }

    private _render(): void {
        this._formContactsElement = cloneTemplate('#contacts');
        this._formInputEmailElement = this._formContactsElement.querySelector('.form__input[name=email]');
        this._formInputPhoneElement = this._formContactsElement.querySelector('.form__input[name=phone]');
        this._formSubmitButtonElement = this._formContactsElement.querySelector('.button[type=submit]');
        this._formErrorsElement = this._formContactsElement.querySelector('.form__errors');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this._formContactsElement);

        this._validateForm();
        this._formInputEmailElement.addEventListener('input', this._changeEmail);
        this._formInputPhoneElement.addEventListener('input', this._changePhone);
        this._formContactsElement.addEventListener('submit', this._submitForm);
    }

    private _renderDisableStatusButton(): void {
        const { validEmail, validPhone } = this._getValidForm();

        this._formSubmitButtonElement.disabled = !validEmail || !validPhone;
    }
    
    private _validateForm(): void {
        const { validEmail, validPhone } = this._getValidForm();

        const errorEmailText = 'Необходимо указать электронную почту';
        const errorPhoneText = 'Необходимо указать номер телефона';

        this._formErrorsElement.innerHTML = `
            ${!validEmail ? errorEmailText : ''}
            ${(!validEmail && !validPhone) ? '<br>' : ''}
            ${!validPhone ? errorPhoneText : ''}
        `;

        this._renderDisableStatusButton();
    }

    private _getValidForm(): { validEmail: boolean, validPhone: boolean } {
        const validEmail = this._formInputEmailElement.value !== '';
        const validPhone = this._formInputPhoneElement.value !== '';

        return { validEmail, validPhone };
    }

    private _changeEmail = (): void => {
        this.orderModel.addEmail(this._formInputEmailElement.value);
        this._validateForm();
    }

    private _changePhone = (): void => {
        this.orderModel.addPhone(this._formInputPhoneElement.value);
        this._validateForm();
    }

    private _submitForm = (event: Event): void => {
        event.preventDefault();
        this.events.emit('modalConfirm:open');
    }
}