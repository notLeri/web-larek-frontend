import { IEvents } from '../../types/index';

export class CatalogItemView {
    protected _title: HTMLSpanElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLSpanElement;
    protected _category: HTMLSpanElement;

    protected _id: string | null = null

    constructor(protected container: HTMLElement, protected events: IEvents) {
        this._title = this.container.querySelector('.card__title');
        this._category = this.container.querySelector('.card__category');
        this._image = this.container.querySelector('.card__image');
        this._price = this.container.querySelector('.card__price');

        this.container.addEventListener("mousedown", (evt) => {
            events.emit('modalPreview:open', { id: this._id });
        });
    }

    public render(data: { id: string, title: string, price: number, image: string, category: string}) {
        if (data) {
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
        return this.container;
    }
}