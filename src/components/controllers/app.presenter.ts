import { API_URL, settings } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { AppApi } from "../model/AppApi";
import { BasketModel } from "../model/BasketModel";
import { CatalogModel } from "../model/CatalogModel";
import { CatalogItemView } from "../View/CatalogItemView";
import { OrderModel } from "../model/OrderModel";
import { Modal } from "../common/Modal";
import { Basket } from "../View/BasketView";
import { Order } from "../View/OrderView";
import { ProductPreview } from "../View/ProductPreviewView";
import { Contacts } from "../View/ContactsView";
import { ConfirmSuccess } from "../View/ConfirmSuccessView";

export class AppPresenter {
    private _events: EventEmitter;
    private _catalogModel: CatalogModel;
    private _basketModel: BasketModel;
    private _orderModel: OrderModel;
    private _api: AppApi;
    private _modal: Modal;
    private _productPreview: ProductPreview;
    private _basket: Basket;
    private _order: Order;
    private _contacts: Contacts;
    private _confirmSuccess: ConfirmSuccess;
    private _nodes: { 
        modalContainer: HTMLElement;
        catalogCardTemplate: HTMLTemplateElement;
        cardPreviewTemplate: HTMLTemplateElement;
        basketTemplate: HTMLTemplateElement;
        basketItemTemplate: HTMLTemplateElement;
        orderTemplate: HTMLTemplateElement;
        contactsTemplate: HTMLTemplateElement;
        confirmSuccessTemplate: HTMLTemplateElement;
        gallery: HTMLElement;
        headerBasketCounterElement: HTMLElement;
        basketButton: HTMLElement;
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
            cardPreviewTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
            basketTemplate: ensureElement<HTMLTemplateElement>('#basket'),
            basketItemTemplate: ensureElement<HTMLTemplateElement>('#card-basket'),
            orderTemplate: ensureElement<HTMLTemplateElement>('#order'),
            contactsTemplate: ensureElement<HTMLTemplateElement>('#contacts'),
            confirmSuccessTemplate: ensureElement<HTMLTemplateElement>('#success'),
            gallery: document.querySelector('.gallery'),
            headerBasketCounterElement: document.querySelector('.header__basket-counter'),
            basketButton: document.querySelector('.header__basket'),
        };

        this._modal = new Modal(this._nodes.modalContainer, this._events);
        this._productPreview = new ProductPreview(cloneTemplate(this._nodes.cardPreviewTemplate), this._events, this._basketModel);
        this._basket = new Basket(cloneTemplate(this._nodes.basketTemplate), this._events, this._basketModel, this._orderModel);
        this._order = new Order(cloneTemplate(this._nodes.orderTemplate), this._events, this._orderModel);
        this._contacts = new Contacts(cloneTemplate(this._nodes.contactsTemplate), this._events, this._orderModel);
        this._confirmSuccess = new ConfirmSuccess(cloneTemplate(this._nodes.confirmSuccessTemplate), this._events);

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

        this._events.on('ui:basket-add', (event: { id: string }) => {
            this._basketModel.add(event.id);
        });

        this._events.on('ui:basket-remove', (event: { id: string }) => {
            this._basketModel.remove(event.id);
            this._basket.removeById(event.id);
            this._modal.render({
                content: this._basket.render({ list: this._basketModel.fullProductsArr })
            });
        });

        this._events.on('modal:close', () => {
            if (this._modal.isOpen()) {
                this._modal.close();
            };
            this._orderModel.resetOrder();
        });

        this._events.on('modalPreview:open', ({ id }: { id: string } ) => {
            const ApiItem = this._catalogModel.getProduct(id);

            this._modal.render({
                content: this._productPreview.render({data: ApiItem})
            });
        });

        this._events.on('modalBasket:open', () => {
            this._modal.render({
                content: this._basket.render({ list: this._basketModel.fullProductsArr })
            });
        });

        this._events.on('modalOrder:open', () => {
            this._modal.render({
                content: this._order.render({})
            })
            this._order.resetInputs();
        });
        
        this._events.on('modalContacts:open', () => {
            this._modal.render({
                content: this._contacts.render({})
            })
            this._contacts.resetInputs();
        });

        this._events.on('modalConfirmSuccess:open', () => {
            this._modal.render({
                content: this._confirmSuccess.render({ price: this._orderModel.price })
            });
        });

        this._events.on('sendOrder', () => {
            this._api.order(this._orderModel.order)
                .then((res) => {
                    this._events.emit('modalConfirmSuccess:open');
                    console.log(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        });

        this._events.on('initialData:loaded', () => {
            const productArray = this._catalogModel.items.map((item) => {
                const productInstant = new CatalogItemView(cloneTemplate(this._nodes.catalogCardTemplate), this._events);
                return productInstant.render({ item });
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