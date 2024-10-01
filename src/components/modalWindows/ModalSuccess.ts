import { cloneTemplate } from '../../utils/utils'
import { EventEmitter } from '../base/events';
import { Modal } from '../common/Modal'
import { OrderModel } from '../model/OrderModel';

export class ModalSuccess extends Modal {
    orderSuccessElement: HTMLElement;
    orderSuccessDescriptionElement: HTMLParagraphElement;
    orderSuccessBtnElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private readonly orderModel: OrderModel
    ) {
        super(container, events)
    }

    override open(): void {
        this.render();
        this.open();
    }

    override close(): void {
        this.orderModel.resetOrder();
        super.close();
    }

    private render(): void {
        this.orderSuccessElement = cloneTemplate('.success');
        this.orderSuccessDescriptionElement = this.orderSuccessElement.querySelector('.order-success__description');
        this.orderSuccessBtnElement = this.orderSuccessElement.querySelector('.order-success__close');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.orderSuccessElement);
        
        this.orderSuccessDescriptionElement.textContent = `Списано ${'smth'} синапсов`;
        this.orderSuccessBtnElement = this.orderSuccessElement.querySelector('.order-success__close');
        this.orderSuccessBtnElement.addEventListener('click', this.handleClick)
    }

    private handleClick = (): void => {
        this.close()
    }
}