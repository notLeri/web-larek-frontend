import { IConfirmSuccess } from "../../types/view";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class ConfirmSuccess extends Component<IConfirmSuccess> {
    private _orderSuccessDescriptionElement: HTMLParagraphElement;
    private _orderSuccessBtnElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
    ) {
        super(container, events);

        this._orderSuccessDescriptionElement = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
        this._orderSuccessBtnElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._orderSuccessBtnElement.addEventListener('click', () => this.events.emit('modal:close'));
    }

    set price(value: number) {
        this.setText(this._orderSuccessDescriptionElement, `Списано ${value} синапсов`);
    }
}