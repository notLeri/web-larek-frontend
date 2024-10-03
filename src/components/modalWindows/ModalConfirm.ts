import { cloneTemplate } from '../../utils/utils'
import { EventEmitter } from '../base/events';
import { Modal } from '../common/Modal'
import { OrderModel } from '../model/OrderModel';

export class ModalConfirm extends Modal {
    private _orderSuccessElement: HTMLElement;
    private _orderSuccessDescriptionElement: HTMLParagraphElement;
    private _orderSuccessBtnElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private readonly orderModel: OrderModel
    ) {
        super(container, events)
    }

    override open(): void {
        this._render();
        super.open();
    }

    private _render(): void {
        this._orderSuccessElement = cloneTemplate('#success');
        this._orderSuccessDescriptionElement = this._orderSuccessElement.querySelector('.order-success__description');
        this._orderSuccessBtnElement = this._orderSuccessElement.querySelector('.order-success__close');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this._orderSuccessElement);
        
        this._orderSuccessDescriptionElement.textContent = `Списано ${this.orderModel.price} синапсов`;
        this._orderSuccessBtnElement = this._orderSuccessElement.querySelector('.order-success__close');
        this._orderSuccessBtnElement.addEventListener('click', this._handleClick)
    }

    private _handleClick = (): void => {
        this.close()
    }
}