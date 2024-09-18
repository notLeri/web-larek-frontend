import { IView, IEvents } from '../../types/index';

export class BasketItemView implements IView {
    protected title: HTMLSpanElement;
    protected addButton: HTMLButtonElement;
    protected removeButton: HTMLButtonElement;

    protected id: string | null = null

    constructor(protected container: HTMLElement, protected events: IEvents) {
        this.title = document.querySelector('span');
        this.addButton = document.querySelector('button');
        this.removeButton = document.querySelector('button');

        this.addButton.addEventListener('click', () => {
            this.events.emit('ui:basket-add', { id: this.id });
        });

        this.addButton.addEventListener('click', () => {
            this.events.emit('ui:basket-remove', { id: this.id });
        });
    }

    render(data: { id: string, title: string, price: number }) {
        if (data) {
            this.id = data.id;
            this.title.textContent = data.title;
        }
        return this.container;
    }
}

