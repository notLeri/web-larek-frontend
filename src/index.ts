import './scss/styles.scss';

import { orderAPI, productAPI } from './components/model/apiHandler';
import { catalog } from './components/model/catalog';

catalog.updateState().then(() => console.log(catalog.getAll()));
