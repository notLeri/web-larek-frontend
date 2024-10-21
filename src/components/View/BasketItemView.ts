import { IBasketItemView } from "../../types/view";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class BasketItem extends Component<IBasketItemView> {
    private _cardIndex: HTMLSpanElement;
    private _cardTitle: HTMLSpanElement;
    private _cardPrice: HTMLSpanElement;
    private _cardDelete: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events)

        this._cardIndex = ensureElement<HTMLSpanElement>(`.basket__item-index`, this.container);
        this._cardTitle = ensureElement<HTMLSpanElement>(`.card__title`, this.container);
        this._cardPrice = ensureElement<HTMLSpanElement>(`.card__price`, this.container);
        this._cardDelete = ensureElement<HTMLButtonElement>(`.basket__item-delete`, this.container);

        
        this._cardDelete.addEventListener('click', () => this._emitDeletion(this.container.id));
    }

    set id(id: string) {
        this.container.id = id;
    }

    set index(index: number) {
        this.setText(this._cardIndex, index);
    }

    set title(title: string) {
        this.setText(this._cardTitle, title);
    }

    set price(price: string) {
        this.setText(this._cardPrice, price);
    }

    private _emitDeletion(id: string): void {
        this.events.emit('ui:basket-remove', { id });
    }
}