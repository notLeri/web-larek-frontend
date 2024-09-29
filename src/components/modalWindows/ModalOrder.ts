import { OrderPayment } from "../../types/order";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Modal } from "../common/Modal";
import { OrderModel } from "../model/OrderModel";

export class ModalOrder extends Modal {
    private formOrderElement: HTMLFormElement;
    private cardOnlineBtnElement: HTMLButtonElement;
    private cashOfflineBtnElement: HTMLButtonElement;
    private addressInputElement: HTMLInputElement;
    private formSubmitButtonElement: HTMLButtonElement;
    private formErrorsElement: HTMLSpanElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private orderModel: OrderModel
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
        this.formOrderElement = cloneTemplate('#order');
        this.cardOnlineBtnElement = this.formOrderElement.querySelector('[name=card]');
        this.cashOfflineBtnElement = this.formOrderElement.querySelector('[name=cash]');
        this.addressInputElement = this.formOrderElement.querySelector('.form__input[name=address]');
        this.formSubmitButtonElement = this.formOrderElement.querySelector('.order__button');
        this.formErrorsElement = this.formOrderElement.querySelector('.form__errors');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.formOrderElement);

        this.cardOnlineBtnElement.addEventListener('click', () => this.changePaymentMethod('online'));
        this.cashOfflineBtnElement.addEventListener('click', () => this.changePaymentMethod('offline'));
        this.addressInputElement.addEventListener('input', this.changeAddress);
        this.formOrderElement.addEventListener('submit', this.submitForm);

        this.validateForm();
    }

    private changeAddress = (): void => {
        this.orderModel.addAddress(this.addressInputElement.value);
        this.validateForm();
    }

    private changePaymentMethod(payment: OrderPayment): void {
        this.orderModel.addPayment(payment);
        
        if (payment === 'online') {
            this.cardOnlineBtnElement.classList.add('button_alt-active');
            this.cashOfflineBtnElement.classList.remove('button_alt-active');
        } else if (payment === 'offline') {
            this.cardOnlineBtnElement.classList.remove('button_alt-active');
            this.cashOfflineBtnElement.classList.add('button_alt-active');
        }

        this.validateForm();
    }

    private submitForm = (event: Event): void => {
        event.preventDefault();
        this.events.emit('modalContacts:open');
    }

    private renderDisableStatusButton(): void {
        const { validPayment, validAddress } = this.getValidForm();

        this.formSubmitButtonElement.disabled = !validPayment || !validAddress;
    }
    
    private validateForm(): void {
        const { validPayment, validAddress } = this.getValidForm();

        const errorPaymentText = 'Необходимо выбрать статус оплаты';
        const errorAdressText = 'Необходимо указать адрес';

        this.formErrorsElement.innerHTML = `
            ${!validPayment ? errorPaymentText : ''}
            ${(!validPayment && !validAddress) ? '<br>' : ''}
            ${!validAddress ? errorAdressText : ''}
        `;

        this.renderDisableStatusButton();
    }

    private getValidForm() {
        const validPayment = (
            this.cardOnlineBtnElement.classList.contains('button_alt-active') ||
            this.cashOfflineBtnElement.classList.contains('button_alt-active')
        );
        const validAddress = this.addressInputElement.value !== '';

        return { validPayment, validAddress };
    }
}