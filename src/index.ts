import './scss/styles.scss';

import { Api } from './components/base/api'
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/model/AppApi';
import { CatalogModel } from './components/model/CatalogModel';
import { BasketModel } from './components/model/BasketModel';
import { BasketView } from './components/View/BasketView';
import { BasketItemView } from './components/View/BasketItemView';
import { IApi } from './types';
import { API_URL, settings } from './utils/constants'

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const basketView = new BasketView(document.querySelector('.basket'));

const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

function renderBasket(items: string[]) {
    basketView.render(
        items.map(id => {
            const itemView = new BasketItemView(events);
            return itemView.render(catalogModel.getProduct(id));
        })
    );
}

events.on('basket:change', (event: { items: string[] }) => renderBasket(event.items));

events.on('ui:basket-add', (event: { id: string }) => basketModel.add(event.id));

events.on('ui:basket-remove', (event: { id: string }) => basketModel.remove(event.id));

api.getProductList()
    .then(catalogModel.setItems.bind(catalogModel))
    .catch(err => console.error(err));

// api.getProductList().then((list) => console.log(list));
