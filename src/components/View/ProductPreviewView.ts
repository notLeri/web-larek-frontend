import { IItemAPI } from "../../types";
import { IProductPreview } from "../../types/view";
import { categoryCSSClasses } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";
import { BasketModel } from "../model/BasketModel";

export class ProductPreview extends Component<IProductPreview> {
    private _data: IItemAPI;
    private _imageElement: HTMLImageElement;
    private _categoryElement: HTMLSpanElement;
    private _titleElement: HTMLHeadingElement;
    private _descriptionElement: HTMLParagraphElement;
    private _buttonElement: HTMLButtonElement;
    private _priceElement: HTMLSpanElement;
    private _basketModel: BasketModel;

    constructor(container: HTMLElement, events: EventEmitter, basketModel: BasketModel) {
        super(container, events);

        this._basketModel = basketModel;
        this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
        this._titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this._descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this._priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);

        this._buttonElement.addEventListener('click', () => this._handleClick(this._data));
    }

    set data(data: IItemAPI) {
        this._data = data;
        this._renderItem(data);
    }

    private _handleClick(data: IItemAPI): void {
        if (this._basketModel.has(data.id)) {
            this._basketModel.remove(data.id);
        } else {
            this._basketModel.add(data.id);
        }

        this._renderButtonText(data);
    }

    private _renderItem(data: IItemAPI): void {
        this.setImage(this._imageElement, data.image);
        this.setText(this._categoryElement, data.category);
        this.setText(this._titleElement, data.title);
        this.setText(this._descriptionElement, data.description);
        this.setText(this._priceElement, data.price ===  null ? 'Бесценно' : `${data.price} синапсов`);

        this._categoryElement.classList.remove('card__category_other');
        const categoryCSSClass = categoryCSSClasses[data.category]
        this._categoryElement.classList.add(categoryCSSClass);

        this._renderButtonText(data);
        if (data.price === null) {
            this.setDisabled(this._buttonElement, true);
        } else {
            this.setDisabled(this._buttonElement, false);
        }
    }


    private _renderButtonText(data: IItemAPI): void {
        if (!this._basketModel.has(data.id)) {
            this._buttonElement.textContent = "Купить";
            this.setText(this._buttonElement, "Купить");
        } else {
            this.setText(this._buttonElement, "Убрать");
        }
        if (data.price === null) {
            this.setText(this._buttonElement, "Не продаётся");
        }
    }
}