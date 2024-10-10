import { IItemAPI } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { BasketModel } from '../model/BasketModel';
import { OrderModel } from '../model/OrderModel';

export interface IBasket {

}

export class Basket extends Component<IBasket> {
    // private _basketElement: HTMLElement;
    private _basketList: HTMLElement;
    private _basketPriceElement: HTMLElement;
    private _basketSubmitButton: HTMLButtonElement;

    constructor(
        blockName: string,
        container: HTMLElement,
        events: EventEmitter,
        private _basketModel: BasketModel,
        private _orderModel: OrderModel,
    ) {
        super(container, events);

        // this._basketElement = cloneTemplate('#basket');
        this._basketList = ensureElement<HTMLElement>(`.${blockName}__list`, container);
        this._basketSubmitButton = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);
        this._basketPriceElement = ensureElement<HTMLSpanElement>(`.${blockName}__price`, container);
        // this.contentContainer.textContent = '';
        // this.setText(this.container, '');
        // this.contentContainer.appendChild(this._basketElement);
        
        this._basketSubmitButton.addEventListener('click', this._placeOrder);
    }
    
    // protected setText(element: HTMLElement, value: unknown) {
    //     if (element) {
    //         element.textContent = String(value);
    //     }
    // }

    // override open(): void {
    //     this._render();
    //     super.open();
    // }

    // render(): HTMLElement {
    //     return super.render();

    //     // this._renderProductList();
    // }   

    private _renderDisableStatusButton(): void {
        this._basketSubmitButton.disabled = this._basketModel.price === 0;
    }
    
    private _renderProductList(): void {
        this._basketList.textContent = '';
        
        const fullProducts = this._basketModel.fullProductsArr;
        
        for (let i = 0; i < fullProducts.length; i++) {
            this._renderProduct(i + 1, fullProducts[i]);
        }
        
        this._renderBasketPrice();
        this._renderDisableStatusButton();
    }

    private _renderProduct(index: number, productData: IItemAPI): void {
        const basketItem = cloneTemplate('#card-basket');

        const cardIndex = basketItem.querySelector('.basket__item-index');
        const cardTitle = basketItem.querySelector('.card__title');
        const cardPrice = basketItem.querySelector('.card__price');
        const cardDelete = basketItem.querySelector('.basket__item-delete');
        const price = productData.price === null ? 'Бесценно' : `${productData.price} синапсов`;

        cardIndex.textContent = `${index}`;
        cardTitle.textContent = productData.title;
        cardPrice.textContent = `${price}`;
        
        cardDelete.addEventListener('click', () => this._handleDeleteItem(productData.id))
        this._basketList.appendChild(basketItem);
    }

    private _renderBasketPrice(): void {
        this._basketPriceElement.textContent = `${this._basketModel.price} синапсов`;
    }

    private _handleDeleteItem = (id: string): void => {
        this._basketModel.remove(id);
        this._renderProductList();
    }

    private _placeOrder = (): void => {
        this.events.emit('modalOrder:open');
        this._orderModel.addItems(this._basketModel.productsID, this._basketModel.price);
    }
}