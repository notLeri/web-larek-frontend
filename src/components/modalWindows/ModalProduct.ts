import { Modal } from '../common/Modal';
import { IEvents, IItemAPI } from '../../types';
import { IBasketModel } from '../../types';
import { cloneTemplate } from '../../utils/utils';

export class ModalProduct extends Modal{
    private titleElement: HTMLHeadingElement;
    private priceElement: HTMLSpanElement;
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private cardFullElement: HTMLElement;

    constructor (container: HTMLElement, events: IEvents, private basket: IBasketModel) {
        super(container, events);
    }

    override open(data: IItemAPI) {
        this.render(data)
        super.open();
    }

    private handleClick(data: IItemAPI): void {
        if (this.basket.has(data.id)) {
            this.basket.remove(data.id);
        } else {
            this.basket.add(data.id);
        }

        this.renderButtonText(data);
    }

    private render(data: IItemAPI): void {
        this.cardFullElement = cloneTemplate('#card-preview');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.cardFullElement);
        
        this.categoryElement = this.cardFullElement.querySelector('.card__category');
        this.imageElement = this.cardFullElement.querySelector(".card__image");
        this.titleElement = this.cardFullElement.querySelector(".card__title");
        this.descriptionElement = this.cardFullElement.querySelector(".card__text");
        this.priceElement = this.cardFullElement.querySelector(".card__price");
        this.buttonElement = this.cardFullElement.querySelector(".card__button");

        this.titleElement.textContent = data.title;
        this.descriptionElement.textContent = data.description;
        this.priceElement.textContent = `${data.price} синапсов`;
        // this.imageElement.src = `<%=require('../images${data.image}')%>`;
        this.categoryElement.textContent = data.category
        
        this.categoryElement.classList.remove('card__category_other');

        switch (data.category) {
            case 'софт-скил': {
                this.categoryElement.classList.add('card__category_soft');
                break;
            }
            case 'другое': { 
                this.categoryElement.classList.add('card__category_other');
                break;
            }
            case 'дополнительное': {
                this.categoryElement.classList.add('card__category_additional');
                break;
            }
            case 'кнопка': {
                this.categoryElement.classList.add('card__category_button');
                break;
            }
            case 'хард-скил': {
                this.categoryElement.classList.add('card__category_hard');
                break;
            }
        }

        this.renderButtonText(data);

        this.buttonElement.addEventListener('click', () => this.handleClick(data));
    }

    private renderButtonText(data: IItemAPI) {
        if (!this.basket.has(data.id)) {
            this.buttonElement.textContent = "Купить";
        } else {
            this.buttonElement.textContent = "Убрать";
        }
    }
}
