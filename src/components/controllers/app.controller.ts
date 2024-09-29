import { API_URL, settings } from "../../utils/constants";
import { cloneTemplate } from "../../utils/utils";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { ModalProduct } from "../modalWindows/ModalProduct";
import { AppApi } from "../model/AppApi";
import { BasketModel } from "../model/BasketModel";
import { CatalogModel } from "../model/CatalogModel";
import { CatalogItemView } from "../View/CatalogItemView";
import { ModalBasket } from "../modalWindows/ModalBasket";
import { ModalOrder } from "../modalWindows/ModalOrder";
import { OrderModel } from "../model/OrderModel";
import { ModalContacts } from "../modalWindows/ModalContacts";

export class AppControler {
    private events: EventEmitter;
    private catalogModel: CatalogModel;
    private basketModel: BasketModel;
    private orderModel: OrderModel;
    private api: AppApi;
    private productModal: ModalProduct;
    private basketModal: ModalBasket;
    private orderModal: ModalOrder;
    private contactsModal: ModalContacts;
    private nodes: { 
        modalContainer: HTMLElement;
        catalogCardTemplate: HTMLTemplateElement;
        gallery: HTMLElement;
        headerBasketCounterElement: HTMLElement;
        basketButton: HTMLElement;
        basketListElement: HTMLElement;
    };
    private initedController: boolean = false;

    constructor() {
        this.events = new EventEmitter();
        this.catalogModel = new CatalogModel(this.events);
        this.basketModel = new BasketModel(this.events, this.catalogModel);
        this.orderModel = new OrderModel();

        const baseApi = new Api(API_URL, settings);
        this.api = new AppApi(baseApi);

        this.nodes = {
            modalContainer: document.querySelector('#modal-container') as HTMLElement,
            catalogCardTemplate: document.querySelector('#card-catalog'),
            gallery: document.querySelector('.gallery'),
            headerBasketCounterElement: document.querySelector('.header__basket-counter'),
            basketListElement: document.querySelector('.basket__list'),
            basketButton: document.querySelector('.header__basket'),
        };

        this.productModal = new ModalProduct(this.nodes.modalContainer, this.events, this.basketModel);
        this.basketModal = new ModalBasket(this.nodes.modalContainer, this.events, this.basketModel, this.api);
        this.orderModal = new ModalOrder(this.nodes.modalContainer, this.events, this.orderModel);
        this.contactsModal = new ModalContacts(this.nodes.modalContainer, this.events, this.orderModel);

        this.nodes.basketButton.addEventListener("click", () => {
           this.events.emit('modalBasket:open');
        });
    }

    public init(): void {
        if (this.initedController === true) return;

        this.initedController = true;

        this.listenEvents();
        this.fetchProductList();
    }

    // private renderBasket(items: string[]): void {
    //     const basketItems = items.map(id => {
    //         const item: HTMLElement = document.querySelector('.basket__item');
    //         const itemView: BasketItemView = new BasketItemView(item, this.events);
    //         return itemView.render(this.catalogModel.getProduct(id));
    //     })
    //     this.basketView.render({ items: basketItems });
    // }

    private changeHeaderBasketQuantity(items: string[]): void {
        this.nodes.headerBasketCounterElement.textContent = `${items.length}`
    }

    private listenEvents() {
        this.events.on('basket:change', (event: { items: string[] }) => this.changeHeaderBasketQuantity(event.items));

        this.events.on('ui:basket-add', (event: { id: string }) => this.basketModel.add(event.id));

        this.events.on('ui:basket-remove', (event: { id: string }) => this.basketModel.remove(event.id));

        this.events.on('modalPreview:open', ({ id }: { id: string } ) => {
            const ApiItem = this.catalogModel.getProduct(id);
            this.productModal.open(ApiItem);
        });

        this.events.on('modalBasket:open', () => {
            this.basketModal.open();
        });

        this.events.on('modalOrder:open', () => {
            this.orderModal.open();
        })
        
        this.events.on('modalContacts:open', () => {
            this.contactsModal.open();
        })

        this.events.on('modalConfirm:open', () => {
            
        })

        this.events.on('initialData:loaded', () => {
            const productArray = this.catalogModel.items.map((item) => {
                const productInstant = new CatalogItemView(cloneTemplate(this.nodes.catalogCardTemplate), this.events);
                return productInstant.render(item);
            });
            productArray.forEach(product => {
                this.nodes.gallery.appendChild(product)
            })
        });

    }

    private fetchProductList(): void {
        this.api.getProductList()
            .then((list) => {
                this.catalogModel.setItems(list.items)
                this.events.emit('initialData:loaded');
            })
            .catch(err => console.error(err));
    }
}