import { API_URL, settings } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
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
import { ModalConfirm } from "../modalWindows/ModalConfirm";
import { Modal } from "../common/Modal";
import { Basket } from "../modalWindows/ModalBasketCopy";

export class AppPresenter {
    private _events: EventEmitter;
    private _catalogModel: CatalogModel;
    private _basketModel: BasketModel;
    private _orderModel: OrderModel;
    private _api: AppApi;
    private _modal: Modal;
    private _productModal: ModalProduct;
    private _basketModal: ModalBasket;
    private _basketModalCopy: Basket;
    private _orderModal: ModalOrder;
    private _contactsModal: ModalContacts;
    private _confirmModal: ModalConfirm;
    private _nodes: { 
        modalContainer: HTMLElement;
        catalogCardTemplate: HTMLTemplateElement;
        gallery: HTMLElement;
        headerBasketCounterElement: HTMLElement;
        basketButton: HTMLElement;
        // basketListElement: HTMLElement;
    };
    private _initedController: boolean = false;

    constructor() {
        this._events = new EventEmitter();
        this._catalogModel = new CatalogModel(this._events);
        this._basketModel = new BasketModel(this._events, this._catalogModel);
        this._orderModel = new OrderModel();

        const baseApi = new Api(API_URL, settings);
        this._api = new AppApi(baseApi);

        this._nodes = {
            modalContainer: ensureElement<HTMLElement>('#modal-container'),
            catalogCardTemplate: document.querySelector('#card-catalog'),
            gallery: document.querySelector('.gallery'),
            headerBasketCounterElement: document.querySelector('.header__basket-counter'),
            // basketListElement: document.querySelector('.basket__list'),
            basketButton: document.querySelector('.header__basket'),
        };

        const basketTemplateElement = ensureElement<HTMLTemplateElement>('#basket');

        this._modal = new Modal(this._nodes.modalContainer, this._events);
        this._productModal = new ModalProduct(this._nodes.modalContainer, this._events, this._basketModel);
        this._basketModal = new ModalBasket(this._nodes.modalContainer, this._events, this._basketModel, this._orderModel);
        // this._basketModalCopy = new Basket(this._nodes.modalContainer, this._events, this._basketModel, this._orderModel);
        this._orderModal = new ModalOrder(this._nodes.modalContainer, this._events, this._orderModel);
        this._contactsModal = new ModalContacts(this._nodes.modalContainer, this._events, this._orderModel);
        this._confirmModal = new ModalConfirm(this._nodes.modalContainer, this._events, this._orderModel);

        this._nodes.basketButton.addEventListener("click", () => {
           this._events.emit('modalBasket:open');
        });
    }

    public init(): void {
        if (this._initedController === true) return;

        this._initedController = true;

        this._listenEvents();
        this._fetchProductList();
    }

    private _changeHeaderBasketQuantity(items: string[]): void {
        this._nodes.headerBasketCounterElement.textContent = `${items.length}`;
    }

    private _listenEvents(): void {
        this._events.on('basket:change', (event: { items: string[] }) => this._changeHeaderBasketQuantity(event.items));

        this._events.on('ui:basket-add', (event: { id: string }) => this._basketModel.add(event.id));

        this._events.on('ui:basket-remove', (event: { id: string }) => this._basketModel.remove(event.id));

        this._events.on('modalPreview:open', ({ id }: { id: string } ) => {
            const ApiItem = this._catalogModel.getProduct(id);
            this._productModal.open(ApiItem);
        });

        this._events.on('modalBasket:open', () => {
            this._modal.render({
                // content: order.render({
                //     phone: '',
                //     email: '',
                //     valid: false,
                //     errors: []
                // })
            });
            
            // this._basketModal.open();
        });

        this._events.on('modalOrder:open', () => {
            this._orderModal.open();
        });
        
        this._events.on('modalContacts:open', () => {
            this._contactsModal.open();
        });

        this._events.on('modalConfirm:open', () => {
            this._api.order(this._orderModel.order)
                .then((res) => {
                    console.log(res)
                });
            this._confirmModal.open();
        });

        this._events.on('initialData:loaded', () => {
            const productArray = this._catalogModel.items.map((item) => {
                const productInstant = new CatalogItemView(cloneTemplate(this._nodes.catalogCardTemplate), this._events);
                return productInstant.render(item);
            });
            productArray.forEach(product => {
                this._nodes.gallery.appendChild(product);
            })
        });

    }

    private _fetchProductList(): void {
        this._api.getProductList()
            .then((list) => {
                this._catalogModel.setItems(list.items);
                this._events.emit('initialData:loaded');
            })
            .catch(err => console.error(err));
    };
}