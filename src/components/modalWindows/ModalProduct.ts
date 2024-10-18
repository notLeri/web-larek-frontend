import { Modal } from '../common/Modal';
import { IItemAPI } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { categoryCSSClasses } from '../../utils/constants';
import { EventEmitter } from '../base/events';
import { IBasketModel } from '../../types/model';

export class ModalProduct extends Modal{
    private _titleElement: HTMLHeadingElement;
    private _priceElement: HTMLSpanElement;
    private _categoryElement: HTMLElement;
    private _imageElement: HTMLImageElement;
    private _descriptionElement: HTMLElement;
    private _buttonElement: HTMLButtonElement;
    private _cardFullElement: HTMLElement;

    constructor (container: HTMLElement, events: EventEmitter, private basketModel: IBasketModel) {
        super(container, events);
    }

    // override open(data: IItemAPI): void {
    //     this._render(data)
    //     super.open();
    // }

    private _handleClick(data: IItemAPI): void {
        if (this.basketModel.has(data.id)) {
            this.basketModel.remove(data.id);
        } else {
            this.basketModel.add(data.id);
        }

        this._renderButtonText(data);
    }

    private _render(data: IItemAPI): void {
        this._cardFullElement = cloneTemplate('#card-preview');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this._cardFullElement);
        
        this._categoryElement = this._cardFullElement.querySelector('.card__category');
        this._imageElement = this._cardFullElement.querySelector(".card__image");
        this._titleElement = this._cardFullElement.querySelector(".card__title");
        this._descriptionElement = this._cardFullElement.querySelector(".card__text");
        this._priceElement = this._cardFullElement.querySelector(".card__price");
        this._buttonElement = this._cardFullElement.querySelector(".card__button");

        this._titleElement.textContent = data.title;
        this._descriptionElement.textContent = data.description;
        this._priceElement.textContent = data.price ===  null ? 'Бесценно' : `${data.price} синапсов`;
        this._imageElement.src = `./images${data.image}`;
        this._categoryElement.textContent = data.category
        
        this._categoryElement.classList.remove('card__category_other');

        const categoryCSSClass = categoryCSSClasses[data.category]
        this._categoryElement.classList.add(categoryCSSClass);

        this._renderButtonText(data);

        this._buttonElement.addEventListener('click', () => this._handleClick(data));
    }

    private _renderButtonText(data: IItemAPI): void {
        if (!this.basketModel.has(data.id)) {
            this._buttonElement.textContent = "Купить";
        } else {
            this._buttonElement.textContent = "Убрать";
        }
    }
}
