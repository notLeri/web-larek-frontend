import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketItemView {

}

export class BasketItem extends Component<IBasketItemView> {
    private cardIndex: HTMLSpanElement;
    private cardTitle: HTMLSpanElement;
    private cardPrice: HTMLSpanElement;
    private cardDelete: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events)

        this.cardIndex = ensureElement<HTMLSpanElement>(`.basket__item-index`, this.container);
        this.cardTitle = ensureElement<HTMLSpanElement>(`.card__title`, this.container);
        this.cardPrice = ensureElement<HTMLSpanElement>(`.card__price`, this.container);
        this.cardDelete = ensureElement<HTMLButtonElement>(`.basket__item-delete`, this.container);

        
        this.cardDelete.addEventListener('click', () => this._emitDeletion(this.container.id));
    }

    set id(id: string) {
        this.container.id = id;
    }

    set index(index: number) {
        this.cardIndex.textContent = `${index}`;
    }

    set title(title: string) {
        this.cardTitle.textContent = `${title}`;
    }

    set price(price: number) {
        this.cardPrice.textContent = `${price}`;
    }

    private _emitDeletion(id: string): void {
        this.events.emit('ui:basket-remove', { id });
    }
}