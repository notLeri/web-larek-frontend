import { IModal } from "../../types/view";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Modal extends Component<IModal> {
    protected events: EventEmitter;
    protected contentContainer: HTMLElement;
    protected container: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        this.container = container;
        this.events = events;
        const closeButtonElement = this.container.querySelector(".modal__close");
        closeButtonElement.addEventListener("click", this.close.bind(this));
        this.container.addEventListener("pointerdown", (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    set content(value: HTMLElement) {
        this.contentContainer.replaceChildren(value);
    }

    open(): void {
        this.toggleClass(this.container, "modal_active", true);
        document.addEventListener("keyup", this.handleEscUp);
    }
  
    close(): void {
        this.toggleClass(this.container, "modal_active", false);
        document.removeEventListener("keyup", this.handleEscUp);
        this.events.emit('modal:close');
    }
  
    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
    };
    
    isOpen(): boolean {
        return this.container.classList.contains("modal_active");
    }
    
    override render(data?: Partial<IModal>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}