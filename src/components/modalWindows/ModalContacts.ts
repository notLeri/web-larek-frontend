import { cloneTemplate } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Modal } from "../common/Modal";
import { OrderModel } from "../model/OrderModel";

export class ModalContacts extends Modal {
    private formContactsElement: HTMLFormElement;
    private formInputEmailElement: HTMLInputElement;
    private formInputPhoneElement: HTMLInputElement;
    private formSubmitButtonElement: HTMLButtonElement;
    private formErrorsElement: HTMLSpanElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private readonly orderModel: OrderModel
    ) {
        super(container, events);
    }

    override open() {
        this.render();
        super.open();
    }
    
    override close() {
        this.orderModel.resetOrder();
        super.close();
    }

    private render() {
        this.formContactsElement = cloneTemplate('#contacts');
        this.formInputEmailElement = this.formContactsElement.querySelector('.form__input[name=email]');
        this.formInputPhoneElement = this.formContactsElement.querySelector('.form__input[name=phone]');
        this.formSubmitButtonElement = this.formContactsElement.querySelector('.button[type=submit]');
        this.formErrorsElement = this.formContactsElement.querySelector('.form__errors');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.formContactsElement);

        this.validateForm();
        this.formInputEmailElement.addEventListener('input', this.changeEmail);
        this.formInputPhoneElement.addEventListener('input', this.changePhone);
        this.formContactsElement.addEventListener('submit', this.submitForm);
    }

    private renderDisableStatusButton(): void {
        const { validEmail, validPhone } = this.getValidForm();

        this.formSubmitButtonElement.disabled = !validEmail || !validPhone;
    }
    
    private validateForm(): void {
        const { validEmail, validPhone } = this.getValidForm();

        const errorEmailText = 'Необходимо указать электронную почту';
        const errorPhoneText = 'Необходимо указать номер телефона';

        this.formErrorsElement.innerHTML = `
            ${!validEmail ? errorEmailText : ''}
            ${(!validEmail && !validPhone) ? '<br>' : ''}
            ${!validPhone ? errorPhoneText : ''}
        `;

        this.renderDisableStatusButton();
    }

    private getValidForm() {
        const validEmail = this.formInputEmailElement.value !== '';
        const validPhone = this.formInputPhoneElement.value !== '';

        return { validEmail, validPhone };
    }

    private changeEmail = (): void => {
        this.orderModel.addEmail(this.formInputEmailElement.value);
        this.validateForm();
    }

    private changePhone = (): void => {
        this.orderModel.addPhone(this.formInputPhoneElement.value);
        this.validateForm();
    }

    private submitForm = (event: Event): void => {
        event.preventDefault();
        this.events.emit('modalConfirm:open');
    }
}