import { IItemAPI } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Modal } from '../common/Modal';
import { AppApi } from '../model/AppApi';
import { BasketModel } from '../model/BasketModel';
import { OrderModel } from '../model/OrderModel';

export class ModalBasket extends Modal {
    private basketElement: HTMLElement;
    private basketList: HTMLElement;
    private basketPriceElement: HTMLElement;
    private basketSubmitButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private basketModel: BasketModel,
        private orderModel: OrderModel,
        private api: AppApi
    ) {
        super(container, events);
    }

    override open(): void {
        this.render();
        super.open();
    }

    private render(): void {
        this.basketElement = cloneTemplate('#basket');
        this.basketList = this.basketElement.querySelector('.basket__list');
        this.basketPriceElement = this.basketElement.querySelector('.basket__price');
        this.basketSubmitButton = this.basketElement.querySelector('.basket__button');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.basketElement);

        this.basketSubmitButton.addEventListener('click', this.placeOrder);

        this.renderProductList();
    }

    private renderDisableStatusButton(): void {
        this.basketSubmitButton.disabled = this.basketModel.price === 0;
    }

    private placeOrder = (): void => {
        this.events.emit('modalOrder:open');
        this.orderModel.addItems(this.basketModel.productsID, this.basketModel.price);
    }

    private renderProductList(): void {
        this.basketList.textContent = '';
        
        const fullProducts = this.basketModel.fullProductsArr;
        
        for (let i = 0; i < fullProducts.length; i++) {
            this.renderProduct(i + 1, fullProducts[i]);
        }
        
        this.renderBasketPrice();
        this.renderDisableStatusButton();
    }

    private renderProduct(index: number, productData: IItemAPI): void {
        const basketItem = cloneTemplate('#card-basket');

        const cardIndex = basketItem.querySelector('.basket__item-index');
        const cardTitle = basketItem.querySelector('.card__title');
        const cardPrice = basketItem.querySelector('.card__price');
        const cardDelete = basketItem.querySelector('.basket__item-delete');
        const price = productData.price === null ? 'Бесценно' : `${productData.price} синапсов`;

        cardIndex.textContent = `${index}`;
        cardTitle.textContent = productData.title;
        cardPrice.textContent = `${price}`;

        cardDelete.addEventListener('click', () => this.handleDeleteItem(productData.id))
         this.basketList.appendChild(basketItem);
    }

    private renderBasketPrice(): void {
        this.basketPriceElement.textContent = `${this.basketModel.price} синапсов`;
    }

    private handleDeleteItem = (id: string): void => {
        this.basketModel.remove(id);
        this.renderProductList();
    }
}