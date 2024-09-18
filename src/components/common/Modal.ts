import { IEvents } from "../../types/index";
import { Component } from "../base/Component";

export class Modal <T> extends Component<T> {
    protected modal: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        const closeButtonElement = this.container.querySelector(".popup__close");
        closeButtonElement.addEventListener("click", this.close.bind(this));
        this.container.addEventListener("mousedown", (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    open() {
        this.container.classList.add("popup_is-opened");
        document.addEventListener("keyup", this.handleEscUp);
    }
  
    close() {
        this.container.classList.remove("popup_is-opened");
        document.removeEventListener("keyup", this.handleEscUp);
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
    };
}