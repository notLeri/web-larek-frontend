import { IItemAPI } from '../../types/index';
import { ICatalogItemView } from '../../types/view';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class CatalogItemView extends Component<ICatalogItemView> {
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected _title: HTMLHeadingElement;
    protected _price: HTMLSpanElement;

    protected _id: string | null = null

    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLSpanElement>('.card__category', this.container);
        this._title = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this._price = ensureElement<HTMLSpanElement>('.card__price', this.container);

        this.container.addEventListener("mousedown", () => {
            events.emit('modalPreview:open', { id: this._id });
        });
    }

    set item(data: IItemAPI) {
        this._id = data.id;
        this._title.textContent = data.title;
        this._category.textContent = data.category;
        this._category.classList.remove('card__category_soft');

        switch (data.category) {
            case 'софт-скил': {
                this._category.classList.add('card__category_soft');
                break;
            }
            case 'другое': { 
                this._category.classList.add('card__category_other');
                break;
            }
            case 'дополнительное': {
                this._category.classList.add('card__category_additional');
                break;
            }
            case 'кнопка': {
                this._category.classList.add('card__category_button');
                break;
            }
            case 'хард-скил': {
                this._category.classList.add('card__category_hard');
                break;
            }
        }

        this._image.src = `./images${data.image}`;

        const price = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
        this._price.textContent = `${price}`;
    }
}