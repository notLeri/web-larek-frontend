import { IBasketModel, IEvents, IItemAPI } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { Modal } from '../common/Modal';
import { AppApi } from '../model/AppApi';

export class ModalBasket extends Modal {
    private basketElement: HTMLElement;
    private basketList: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, private basket: IBasketModel, private api: AppApi) {
        super(container, events);
    }

    override open(): void {
        this.basketElement = cloneTemplate('#basket');
        this.basketList = document.querySelector('.basket__list');
        this.contentContainer.textContent = '';
        this.contentContainer.appendChild(this.basketElement);

        this.renderProductList(this.basket.products);
        super.open();
    }

    public renderProductList(items: Map<string, number>): void {
        const itemsArray = Array.from(items)
        itemsArray.forEach(item => {
            const productData = this.api.getProductItem(item[0])
            
            this.renderProduct(productData)
        })
        
        super.open();
    }

    private renderProduct(productData: Promise<IItemAPI>): void {
        const cardTemplate = cloneTemplate('#card-basket');
        const cardIndex = cardTemplate.querySelector('.basket__item-index');
        const cardTitle = cardTemplate.querySelector('.card__title');
        const cardPrice = cardTemplate.querySelector('.card__price');
        const cardDelete = cardTemplate.querySelector('.basket__item-delete');


        // this.basketList.appendChild();
    }
    
    private handleSubmit(): void {
        
    }

    private _changed(): void {
        
    }

    private calculatePrice(numbers: number[]): number {
        const sum = numbers.reduce(function(a: number, b: number){
            return a + b;
        }, 0);
        return sum
    }
}