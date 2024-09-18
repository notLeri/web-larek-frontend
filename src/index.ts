import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api'
import { AppApi } from './components/model/AppApi';
import { catalog } from './components/model/Catalog';
import { IApi } from './types';
import { API_URL } from './utils/constants'

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

catalog.updateState().then(() => console.log(catalog.getAll()));
