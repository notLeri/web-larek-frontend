import { IItemAPI } from '../../types/index';
import { ICatalogItemView } from '../../types/view';
import { categoryColor } from '../../utils/constants';
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
        this.setText(this._title, data.title);
        this.setText(this._category, data.category);
        
        this.toggleClass(this._category, `card__category_${categoryColor[data.category]}`, true)

        this._image.src = `./images${data.image}`;

        const price = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
        this.setText(this._price, price);
    }
}