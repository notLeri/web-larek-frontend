import { IItemAPI } from '../../types';
import { IBasket } from '../../types/view';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { BasketModel } from '../model/BasketModel';
import { OrderModel } from '../model/OrderModel';
import { BasketItem } from './BasketItemView';

export class Basket extends Component<IBasket> {
    private cardBasket: HTMLTemplateElement;
    private _basketList: HTMLElement;
    private _basketSubmitButton: HTMLButtonElement;
    private _basketPriceElement: HTMLElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        private _basketModel: BasketModel,
        private _orderModel: OrderModel,
    ) {
        super(container, events);

        this.cardBasket = ensureElement<HTMLTemplateElement>('#card-basket')
        this._basketList = ensureElement<HTMLElement>(`.basket__list`, this.container);
        this._basketSubmitButton = ensureElement<HTMLButtonElement>(`.basket__button`, this.container);
        this._basketPriceElement = ensureElement<HTMLSpanElement>(`.basket__price`, this.container);
        
        this._basketSubmitButton.addEventListener('click', () => this._emitOrder());
    }

    set list(apiList: IItemAPI[]) {
        this._basketList.textContent = '';
        
        const basketList = apiList.map((item, index) => {
            const itemInstance = new BasketItem(cloneTemplate(this.cardBasket), this.events);
            return itemInstance.render({ id: item.id, index: index + 1, title: item.title, price: item.price === null ? '0 синапсов' : `${item.price} синапсов` });
        });

        this._basketPriceElement.textContent =  this._basketModel.price === null ? 'Бесценно' : `${this._basketModel.price} синапсов`;
        basketList.forEach(node => this._basketList.appendChild(node));
        this.setDisabled(this._basketSubmitButton, this._basketModel.price === 0);
    } 
    
    set price(value: number) {
        this._basketPriceElement.textContent = `${value} синапсов`;
    }

    public removeById(id: string): void {
        const nodeToRemove = ensureElement(`[id="${id}"]`, this._basketList);
        this._basketList.removeChild(nodeToRemove);
    }

    private _emitOrder(): void {
        this.events.emit('modalOrder:open');
        this._orderModel.addItems(this._basketModel.productsID, this._basketModel.price);
    }
}