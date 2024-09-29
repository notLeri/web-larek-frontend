import { IItemAPI } from "../../types/index";
import { EventEmitter } from "../base/events";

export class Modal {
    protected modal: HTMLElement;
    protected events: EventEmitter;
    protected contentContainer: HTMLElement;
    protected container: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
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

       this.contentContainer = this.container.querySelector('.modal__content');
    }
  

    open(ApiItem?: IItemAPI) {
        this.container.classList.add("modal_active");
        document.addEventListener("keyup", this.handleEscUp);
    }
  
    close() {
        this.container.classList.remove("modal_active");
        document.removeEventListener("keyup", this.handleEscUp);
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
    };
}