import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Form } from "../base/Form";
import { OrderModel } from "../model/OrderModel";

export class Contacts extends Form {
    private _formInputEmailElement: HTMLInputElement;
    private _formInputPhoneElement: HTMLInputElement;
    
    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private orderModel: OrderModel
    ) {
        super(container, events);

        this._formInputEmailElement = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
        this._formInputPhoneElement = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
        
        this._formInputEmailElement.addEventListener('input', this._changeEmail);
        this._formInputPhoneElement.addEventListener('input', this._changePhone);
        this.container.addEventListener('submit', this._submitForm);
        
        this._validateForm();
    }

    public resetInputs(): void {
        this._formInputEmailElement.value = '';
        this._formInputPhoneElement.value = '';

        this.setDisabled(this._formSubmitButtonElement, true);
    }

    private _renderDisableStatusButton(): void {
        const { validEmail, validPhone } = this._getValidForm();

        this.setDisabled(this._formSubmitButtonElement, !validEmail || !validPhone);
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
        this.events.emit('sendOrder');
    }
}