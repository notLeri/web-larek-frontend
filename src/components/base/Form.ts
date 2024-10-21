import { IForm } from "../../types/view";
import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { EventEmitter } from "./events";

export abstract class Form extends Component<IForm> {
    protected _formSubmitButtonElement: HTMLButtonElement;
    protected _formErrorsElement: HTMLSpanElement;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container, events);

        this._formSubmitButtonElement = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
        this._formErrorsElement = ensureElement<HTMLSpanElement>('.form__errors', this.container);
    }
}   