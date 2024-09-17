import './scss/styles.scss';

import { orderAPI, productAPI } from './components/model/ApiHandler';
import { catalog } from './components/model/catalog';

catalog.updateState().then(() => console.log(catalog.getAll()));
