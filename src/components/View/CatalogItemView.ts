import { IView } from '../../types/index';
import { IEvents } from '../../types/index';

export class CatalogItemView implements IView {
    protected title: HTMLSpanElement;
    protected image: HTMLImageElement;
    protected price: HTMLSpanElement;
    protected category: HTMLSpanElement;

    protected id: string | null = null

    constructor(protected container: HTMLElement, protected events: IEvents) {
        this.title = this.container.querySelector('.card__title');
        this.category = this.container.querySelector('.card__category');
        this.image = this.container.querySelector('.card__image');
        this.price = this.container.querySelector('.card__price');

        this.container.addEventListener("mousedown", (evt) => {
            events.emit('modalPreview:open', { id: this.id });
        });
    }

    render(data: { id: string, title: string, price: number, image: string, category: string}) {
        if (data) {
            this.id = data.id;
            this.title.textContent = data.title;
            this.category.textContent = data.category;

            this.category.classList.remove('card__category_soft');

            switch (data.category) {
                case 'софт-скил': {
                    this.category.classList.add('card__category_soft');
                    break;
                }
                case 'другое': { 
                    this.category.classList.add('card__category_other');
                    break;
                }
                case 'дополнительное': {
                    this.category.classList.add('card__category_additional');
                    break;
                }
                case 'кнопка': {
                    this.category.classList.add('card__category_button');
                    break;
                }
                case 'хард-скил': {
                    this.category.classList.add('card__category_hard');
                    break;
                }
            }

            this.image.src = `./images${data.image}`;

            const price = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
            this.price.textContent = `${price}`;
        }
        return this.container;
    }
}