import { IView, IEvents } from '../../types/index';

export class BasketItemView implements IView {
    protected title: HTMLSpanElement;
    protected addButton: HTMLButtonElement;
    protected removeButton: HTMLButtonElement;

    protected id: string | null = null

    constructor(protected container: HTMLElement, protected events: IEvents) {
        // this.title = this.container.querySelector('.card__title');
        this.removeButton = this.container.querySelector('.basket__item-delete');
    }

    render(data: { id: string, title: string, price: number }) {
        if (data) {
            this.id = data.id;
            this.title.textContent = data.title;
        }
        return this.container;
    }
}

