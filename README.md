# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components - основная папка с логикой работы сайта

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Список товаров приходящих с сервера API.

```
export interface IListAPI {
    total: number;
    items: IItemAPI[];
}
```

Сам товар приходящий с сервера API.

```
export interface IItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: TCategory;
    price: number | null;
}
```

Заказ отправляемый на сервер.

```
export interface IOrder {
    payment: OrderPayment,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}
```

Модель каталога, отвечающая за работу с данными списка продуктов на главном экране.

```
export interface ICatalogModel {
    items: IItemAPI[];
    setItems(items: IItemAPI[]): void;
    getProduct(id: string): IItemAPI | null;
}
```

Модель корзины, отвечающая за работу с данными внутри корзины.

```
export interface IBasketModel<T = string> {
    add(item: T): void;
    remove(item: T): void;
    has(item: T): boolean;
    get products(): Map<string, number>;
}
```

Модель заказа, для работы с данными о заказе, в процессе его оформления.

```
export interface IOrderModel {
    addItems: (items: string[], price: number) => void;
    addPayment: (payment: OrderPayment) => void;
    addEmail: (email: string) => void;
    addPhone: (phone: string) => void;
    addAddress: (address: string) => void;
    get order(): IOrder;
    resetOrder: () => void;
}
```

Класс для исполнения функций самого модального окна.

```
export interface IModal {
    open(id?: string): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
}
```

Класс для исполнения функций корзины.

```
export interface IBasket {
    getItems: () => IBasketItem[];
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
}
```

Интерфейс товара отображаемого в каталоге.

```
export interface ICatalogItem {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Интерфейс товара отображаемого в корзине.

```
export interface IBasketItem {
    id: string;
    title: string;
    price: number;
}
```

Ответ с сервера в случае успешного запрошенного заказа.

```
export type SuccessResult =  {
    id: string,
    total: number
}
```

Ответ с сервера в случае неудачно запрошенного заказа.

```
export type ErrorResult = {
    error: string
}
```

Интерфейс заполняемых данных с модального окна (метод оплаты и адрес доставки).

```
export interface IOrderFormPaymentAddress {
    payment: OrderPayment;
    address: string;
}
```

Интерфейс заполняемых данных с модального окна (электронная почта и телефон).

```
export interface IOrderFormMailPhone {
    email: string;
    phone: string;
}
```

Категории товара.

```
export type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- контроллер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Реализует IApi интерфейс. Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:
- baseUrl: string;
- options: RequestInit;

Методы: 
- handleResponse<T>(response: Response): Promise<T> - разбирает приходящий ответ с сервера на выполненный запрос, принимает и парсит в json формат или выбрасывает ошибку.
- get<T>(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс AppPresenter
Класс представляет собой всё приложение магазина, выполняя роль презентера.\

Поля класса:
Все модели приложения и модальные окна, а также api и EventEmitter.
- _nodes: HTMLElement{} - объект HTML элементов и HTML шаблонов для отображения.
- _initedController: boolean - свойство хранящее в себе значение запускалось ли приложение, чтобы не запустить его дважды.

Методы:
- init(): void - инициилизирует приложение.
- _changeHeaderBasketQuantity(items: string[]): void - для изменения отображаемого количества товаров над иконкой корзины в header'е.
- _listenEvents(): void - для инициализации событий приложения.
- _fetchProductList(): void - запрос на сервер и отображение изначальной коллекции товаров в каталоге.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalProduct
Расширяет класс Modal. Предназначен для реализации модального окна целого товара. Сохраняет полученный в параметрах обработчик событий и модель корзины для работы с данными корзины.\

Поля класса:
- _titleElement: HTMLHeadingElement; - Название товара.
- _priceElement: HTMLSpanElement; - Цена товара.
- _categoryElement: HTMLElement; - Категория товара.
- _imageElement: HTMLImageElement; - Изображение товара.
- _descriptionElement: HTMLElement; - Описание товара.
- _buttonElement: HTMLButtonElement; - Кнопка купить/убрать из корзины.
- _cardFullElement: HTMLElement; - шаблон товара.

Методы:
- open(data: IItemAPI): void - перезаписанное открытие модального окна с отображением.
- _handleClick(data: IItemAPI): void - функция клика, которая добавляет товар или удаляет из модели корзины данный товар.
- _render(data: IItemAPI): void - общее отображение товара.
- _renderButtonText(data: IItemAPI): void - отображает ту надпись на кнопке в зависимости от пребывания товара в корзине.

#### Класс ModalBasket
Расширяет класс Modal. Предназначен для реализации окна корзины.
Сохраняет полученный в параметрах обработчик событий, который передается для выполнения при начинании оформления заказа.
И принимает 2 модели: корзины и заказа, из модели корзины он получает доступ к данным хранящимся в корзине, а из заказа получает возможность записать данные первой фазы оформления заказа.\

Поля класса:
- _basketElement: HTMLElement; - шаблон корзины.
- _basketList: HTMLElement; - элемент списка продуктов корзины.
- _basketPriceElement: HTMLElement; - элемент общей цены корзины.
- _basketSubmitButton: HTMLButtonElement; - элемент кнопки для дальнейшего оформления заказа.

Методы:
- open(): void - перезаписанный метод модалки, который включает себя отображение.
- _render(): void - общий рендер всей корзины.
- _renderDisableStatusButton(): void - отображает на странице доступна ли кнопка оформления заказа или нет.
- _renderProductList(): void - отображение листа товаров в корзине.
- _renderProduct(index: number, productData: IItemAPI): void - отображение одного продукта из листа товаров в корзине.
- _renderBasketPrice(): void - отображение цены всех товаров в корзине.
- _handleDeleteItem = (id: string): void - функция удаления товара из корзины и перерендера.
- _placeOrder = (): void - функция дальнейшего оформления заказа вместе с подачей в модель заказа данных о товарах.

#### Класс ModalOrder
Расширяет класс Modal. Реализует вторую фазу оформления покупки с введением данных о методе оплаты и адресе доставки. Сохраняет полученный в параметрах обработчик событий и модель заказа для записи данных о заказе.\

Поля класса:
- _formOrderElement: HTMLFormElement; - шаблон заказа.
- _cardOnlineBtnElement: HTMLButtonElement; - переключаемая кнопка на онлайн метод оплаты.
- _cashOfflineBtnElement: HTMLButtonElement; переключаемая кнопка на офлайн метод оплаты.
- _addressInputElement: HTMLInputElement; - поле ввода адреса.
- _formSubmitButtonElement: HTMLButtonElement; - кнопка дальнешего оформления заказа.
- _formErrorsElement: HTMLSpanElement; - поле вывода ошибок при валидации.

Методы:
- open(): void - переписанное открытие модалки с отображением содержимого.
- close(): void - переписанное закрытие модалки с обнулением всего заказа.
- _render(): void - общее отображение содержимого.
- _changeAddress = (): void - ввод данных об адресе заказа.
- _changePaymentMethod(payment: OrderPayment): void - ввод данных о методе оплаты заказа и переключение активной кнопки.
- _renderDisableStatusButton(): void - отображение доступности кнопки дальнейшего оформления.
- _validateForm(): void - принимает результат валидации и отображает ошибки.
- _getValidForm(): { validPayment: boolean, validAddress: boolean} - валидирует форму 2 фазы заказа.
- _submitForm = (event: Event): void - открывает следующую фазу оформления заказа.

#### Класс ModalContacts
Расширяет класс Modal. Реализует 3 фазу оформления заказа (электронную почту и номер телефона). Сохраняет полученный обработчик событий и модель заказа для записи данных о заказе.\

Поля класса:
- _formContactsElement: HTMLFormElement; - шаблон 3 фазы оформления.
- _formInputEmailElement: HTMLInputElement; - поле ввода электронной почты.
- _formInputPhoneElement: HTMLInputElement; - поле ввода телефонного номера.
- _formSubmitButtonElement: HTMLButtonElement; - кнопка отправки заказа.
- _formErrorsElement: HTMLSpanElement; - поле вывода ошибок валидации.

Методы:
- open(): void - перезаписанное открытие модального окна с рендером содержимого.
- close(): void - перезаписанное закрытие модального окна с обнулением данных о заказе.
- _render(): void - общий рендер содержимого формы.
- _renderDisableStatusButton(): void - отображение доступности кнопки для отправки заказа.
- _validateForm(): void - принимает результат валидации и отображает ошибки.
- _getValidForm(): { validEmail: boolean, validPhone: boolean } - валидирует форму 3 фазы заказа.
- _changeEmail = (): void - записывает данные электронной почты в модель заказа.
- _changePhone = (): void - записывает данные телефонного номера в модель заказа.
- _submitForm = (event: Event): void - функция кнопки отправки заказа.

#### Класс ModalConfirm
Расширяет класс Modal. Представляет модальное окно подтвреждения сделанного заказа в случае успеха. Сохраняет полученный обработчик событий и модель заказа для дальнейшей отправки.\

Поля класса:
- _orderSuccessElement: HTMLElement; - шаблон содержимого при успешной отправке заказа.
- _orderSuccessDescriptionElement: HTMLParagraphElement; - описание отправки заказа.
- _orderSuccessBtnElement: HTMLButtonElement; - кнопка подтверждения.

Методы:
- open(): void - перезаписанное открытие модального окна с отображением содержимого.
- _render(): void - общее отображение содержимого.
- _handleClick = (): void - функция подтверждения.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `app.presenter.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `app.presenter.ts`\
В `app.presenter.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\
А в файле `index.ts` инициилизируется само приложение с помощью `app.presenter.ts`.\

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:change` - изменения количества товаров в корзине.
- `ui:basket-add` - добавляющее товар в модель корзины.
- `ui:basket-remove` - удаляющее товар в модель корзины.
- `initialData:loaded` - изначальная загрузка данных и её отображение.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modalPreview:open` - открытие модального окна с товара.
- `modalBasket:open` - открытие модального окна с корзиной.
- `modalOrder:open` - открытие модального окна с формой заполнения заказа (2 фазы).
- `modalContacts:open` - открытие модального окна с формой заполнения заказа (3 фазы).

