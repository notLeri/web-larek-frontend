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
interface IListAPI {
    total: number;
    items: IItemAPI[];
}
```

Сам товар приходящий с сервера API.

```
interface IItemAPI {
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
interface IOrder {
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
interface ICatalogModel {
    setItems(items: IItemAPI[]): void;
    getProduct(id: string): IItemAPI | null;
}
```

Модель корзины, отвечающая за работу с данными внутри корзины.

```
interface IBasketModel<T = string> {
    add(item: T): void;
    remove(item: T): void;
    has(item: T): boolean;
    get products(): Map<string, number>;
}
```

Модель заказа, для работы с данными о заказе, в процессе его оформления.

```
interface IOrderModel {
    addItems: (items: string[], price: number) => void;
    addPayment: (payment: OrderPayment) => void;
    addEmail: (email: string) => void;
    addPhone: (phone: string) => void;
    addAddress: (address: string) => void;
    get order(): IOrder;
    resetOrder: () => void;
}
```

Интерфейс компонента для исполнения функций самого модального окна.

```
interface IModal {
    content: HTMLElement;
    open(ApiItem?: IItemAPI): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
    isOpen(): boolean;
    render(data?: Partial<IModal>): HTMLElement;
}
```

Интерфейс компонента товара в списке главного меню.

```
export interface ICatalogItemView {
    item: IItemAPI;
}
```

Интерфейс компонента контента продукта в модальном окне.

```
export interface IProductPreview {
    data: IItemAPI;
}
```

Интерфейс компонента контента корзины в модальном окне.

```
export interface IBasket {
    list: IItemAPI[];
    price: number;
}
```

Интерфейс компонента контента товара корзины в модальном окне.

```
export interface IBasketItemView {
    id: string;
    index: number;
    title: string;
    price: string;
}
```

Интерфейс компонента контента формы в модальном окне.
```
export interface IForm {
    resetInputs(): void;
}
```

Интерфейс компонента контента подтверждения в случае успеха, в модальном окне.
```
export interface IConfirmSuccess {
    price: number;
}
```

Класс для исполнения функций корзины.

```
interface IBasketModel {
    add(item: T): void;
    remove(item: T): void;
    has(item: T): boolean;
    get products(): Map<string, number>;
}
```

Интерфейс товара отображаемого в каталоге.

```
interface ICatalogItem {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Интерфейс товара отображаемого в корзине.

```
interface IBasketItem {
    id: string;
    title: string;
    price: number;
}
```

Ответ с сервера в случае успешного запрошенного заказа.

```
type SuccessResult =  {
    id: string,
    total: number
}
```

Ответ с сервера в случае неудачно запрошенного заказа.

```
type ErrorResult = {
    error: string
}
```

Интерфейс заполняемых данных с модального окна (метод оплаты и адрес доставки).

```
interface IOrderFormPaymentAddress {
    payment: OrderPayment;
    address: string;
}
```

Интерфейс заполняемых данных с модального окна (электронная почта и телефон).

```
interface IOrderFormMailPhone {
    email: string;
    phone: string;
}
```

Категории товара.

```
type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
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

#### Класс Component
Представляет собой основу компонентов отображения предоставляя небольшой готовый функционал.\
Принимает самый верхний элемент всей ноды, для дальнейшей работы с его детьми, и брокер событий.\

Защищённые методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключение класса.
- setText(element: HTMLElement, value: unknown) - установка значения текста элементу.
- setDisabled(element: HTMLElement, state: boolean) - установить значение disabled для элемента.
- setHidden(element: HTMLElement) - установить значение display -> none.
- setVisible(element: HTMLElement) - убрать свойство display.
- setImage(element: HTMLImageElement, src: string, alt?: string) - назначение src и alt для изображения.
- render(data?: Partial<T>): HTMLElement - рендер всего компонента с вписыванием данных в него.

#### Класс Form
Расширяет класс Component. Представляет собой небольшой функционал классов представления форм.
Принимает самый верхний элемент всей ноды, для дальнейшей работы с его детьми, и брокер событий.\

Поля класса:
- _formSubmitButtonElement: HTMLButtonElement - кнопка отправки формы.
- _formErrorsElement: HTMLSpanElement - элемент для вывода ошибок валидации формы для пользователя.

### Презентер приложения

#### Класс AppPresenter
Класс представляет собой всё приложение магазина, выполняя роль презентера.\

Поля класса:
Все модели приложения и компоненты представления, а также api и EventEmitter.
- _nodes: HTMLElement{} - объект HTML элементов и HTML шаблонов для отображения.
- _initedController: boolean - свойство хранящее в себе значение запускалось ли приложение, чтобы не запустить его дважды.

Методы:
- init(): void - инициилизирует приложение.
- _changeHeaderBasketQuantity(items: string[]): void - для изменения отображаемого количества товаров над иконкой корзины в header'е.
- _listenEvents(): void - для инициализации событий приложения.
- _fetchProductList(): void - запрос на сервер и отображение изначальной коллекции товаров в каталоге.

### Слой данных

#### Класс BasketModel
Класс представляет собой модель данных корзины. Сохраняет полученный брокер событий и получает модель каталога для получения полноценных товаров из него.

Поля класса:
- _items: Map<string, number> = new Map() - Коллекция товаров в корзине, где ключ это айди и число это количество.

Методы:
- add(id: string): void - функция добавления в корзину.
- remove(id: string): void - функция удаления из корзины.
- _changed(): void - реагирует на измненеие корзины и отдаёт объект товаров корзины.
- has(id: string): boolean - функция проверки наличия в корзине товара.
- products(): Map<string, number> - геттер для получения коллекции товаров корзины.
- productsID(): string[] - геттер получения всех айди товаров в корзине.
- fullProducts(): Record<string, IItemAPI> - геттер получения полноценных товаров в корзине.
- fullProductsArr(): IItemAPI[] - геттер получения массива целых товаров.
- price(): number - геттер получения общей цены корзины.

#### Класс CatalogModel
Класс представляет собой модель данных каталога товаров. Сохраняет полученный брокер событий.

Поля класса:
- _items: IItemAPI[] - массив всех товаров в каталоге.

Методы:
- items(): IItemAPI[] - геттер массива всех товаров в каталоге.
- setItems(items: IItemAPI[]): void - обозначение товаров в модель.
- getProduct(id: string): IItemAPI | null - получения товара из каталога по id.

#### Класс OrderModel
Класс представляет собой модель данных оформляемого заказа. 

Поля класса:
- _items: string[]; - массив id товаров на заказ.
- _totalPrice: number = 0; - общая цена заказа.
- _payment: OrderPayment | null = null; - способ оплаты заказа.
- _email: string | null = null; - электронная почта заказчика.
- _phone: string | null = null; - телефонный номер заказчика.
- _address: string | null = null; - адрес заказчика.

Методы:
- addItems(itemIDs: string[], price: number): void - обозначение товаров и их общей цены в заказ.
- addPayment(payment: OrderPayment): void - обозначение способа оплаты.
- addAddress(address: string): void - обозначение адреса заказчика.
- addEmail(email: string): void - обозначение электронной почты заказчика.
- addPhone(phone: string): void - обозначение телефонного номера заказчика.
- order(): IOrder - геттер всей информации заказа в виде объекта.
- price(): number - геттер общей цены заказа.
- getValidOrder(): boolean - проверка все ли данные присутствуют в заказе.
- resetOrder(): void - сброс всех данных о заказе.

### Классы представления

#### Класс Modal
Расширяет класс Component. Предназначен для реализации модального окна.
Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: EventEmitter) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- events: EventEmitter - брокер событий.
- container: HTMLElement - само модальное окно.
- contentContainer: HTMLElement - контейнер для контента модального окна.

Методы:
- set content(value: HTMLElement) - сеттер для вставки элементов в контент модального окна.
- open() - открывает модальное окно.
- close() - закрывает модальное окно.
- handleEscUp(evt: KeyboardEvent) - callback для закрытия модального окна на ESC.
- isOpen(): boolean - проверяет имеет ли класс активного модального окна.
- override render(data?: Partial<IModal>): HTMLElement - отдаёт контейнер компонента и ставит класс активного окна.

#### Класс ProductPreview
Расширяет класс Component. Предназначен для реализации контента модального окна целого товара.\
Сохраняет копию шаблона соответствующего элемента и полученный в параметрах обработчик событий и модель корзины для работы с данными корзины.\

Поля класса:
- _data: IItemAPI - общие данные о данном товаре.
- _titleElement: HTMLHeadingElement; - Название товара.
- _priceElement: HTMLSpanElement; - Цена товара.
- _categoryElement: HTMLSpanElement; - Категория товара.
- _imageElement: HTMLImageElement; - Изображение товара.
- _descriptionElement: HTMLParagraphElement; - Описание товара.
- _buttonElement: HTMLButtonElement; - Кнопка купить/убрать из корзины.
- _basketModel: BasketModel - модель данных корзины.

Методы:
- set data(data: IItemAPI) - сеттер данных о товаре.
- _handleClick(data: IItemAPI): void - функция клика, которая добавляет товар или удаляет из модели корзины данный товар.
- _renderItem(data: IItemAPI): void - заполнение шаблона товара.
- _renderButtonText(data: IItemAPI): void - отображает ту надпись на кнопке в зависимости от пребывания товара в корзине.

#### Класс Basket
Расширяет класс Component. Предназначен для реализации контента модального окна корзины.\
Сохраняет копию шаблона соответствующего элемента и полученный в параметрах обработчик событий, который передается для начала оформления заказа.
И принимает 2 модели: корзины и заказа, из модели корзины он получает доступ к данным хранящимся в корзине, а из заказа получает возможность записать данные первой фазы оформления заказа.\

Поля класса:
- _cardBasket: HTMLTemplateElement - шаблон товара в корзине.
- _basketList: HTMLElement; - элемент списка продуктов корзины.
- _basketSubmitButton: HTMLButtonElement; - элемент кнопки для дальнейшего оформления заказа.
- _basketPriceElement: HTMLElement; - элемент общей цены корзины.

Методы:
- set list(apiList: IItemAPI[]) - сеттер товаров, из полученных данных о списке в корзине, он рендерит весь список.
- set price(value: number) - назначение общей цены корзины.
- removeById(id: string): void - удаление товара из отображённых товаров в списке.
- _emitOrder(): void - запуск оформления товара, добавление данных о товарах и открытие последующего окна.

#### Класс BasketItem
Расширяет класс Component. Предназначен для реализации контента в списке товаров корзины модального окна.\
Сохраняет копию шаблона соответствующего элемента и полученный в параметрах обработчик событий, который передается для начала оформления заказа.\

Поля класса:
- _cardIndex: HTMLSpanElement - элемент indexa товара.
- _cardTitle: HTMLSpanElement - элемент заголовка товара.
- _cardPrice: HTMLSpanElement - элемент цены товара.
- _cardDelete: HTMLButtonElement - элемент кнопки удаления товара.

Методы:
- set id(id: string) - сеттер, для вписания id в элемент, чтобы удалять по id.
- set index(index: number) - сеттер, для вписания index'а в элемент.
- set title(title: string) - сеттер, для вписания названия товара.
- set price(price: string) - сеттер, для вписания цены о товаре.
- _emitDeletion(id: string): void - запуск события удаления товара из корзины.


#### Класс Order
Расширяет класс Form. Реализует 2 фазу оформления покупки с введением данных о методе оплаты и адресе доставки.\
Сохраняет копию шаблона соответствующего элемента и полученный в параметрах обработчик событий и модель заказа для записи данных о заказе.\

Поля класса:
- _cardOnlineBtnElement: HTMLButtonElement; - переключаемая кнопка на онлайн метод оплаты.
- _cashOfflineBtnElement: HTMLButtonElement; переключаемая кнопка на офлайн метод оплаты.
- _addressInputElement: HTMLInputElement; - поле ввода адреса.
- _orderModel: OrderModel - модель данных заказа.

Методы:
- resetInputs(): void - сбросить значения выбранных кнопок и полей ввода.
- _changeAddress = (): void - ввод данных об адресе заказа.
- _changePaymentMethod(payment: OrderPayment): void - ввод данных о методе оплаты заказа и переключение активной кнопки.
- _renderDisableStatusButton(): void - отображение доступности кнопки дальнейшего оформления.
- _validateForm(): void - принимает результат валидации и отображает ошибки.
- _getValidForm(): { validPayment: boolean, validAddress: boolean} - валидирует форму 2 фазы заказа.
- _submitForm = (event: Event): void - запускает следующую фазу оформления заказа.

#### Класс Contacts
Расширяет класс Form. Реализует 3 фазу оформления заказа (электронную почту и номер телефона). Сохраняет копию шаблона соответствующего элемента и полученный обработчик событий и модель заказа для записи данных о заказе.\

Поля класса:
- _formContactsElement: HTMLFormElement; - шаблон 3 фазы оформления.
- _formInputEmailElement: HTMLInputElement; - поле ввода электронной почты.
- _formInputPhoneElement: HTMLInputElement; - поле ввода телефонного номера.
- _orderModel: OrderModel - модель данных заказа.

Методы:
- resetInputs(): void - сбросить значения выбранных кнопок и полей ввода.
- _renderDisableStatusButton(): void - отображение доступности кнопки для отправки заказа.
- _validateForm(): void - принимает результат валидации и отображает ошибки.
- _getValidForm(): { validEmail: boolean, validPhone: boolean } - валидирует форму 3 фазы заказа.
- _changeEmail = (): void - записывает данные электронной почты в модель заказа.
- _changePhone = (): void - записывает данные телефонного номера в модель заказа.
- _submitForm = (event: Event): void - функция кнопки отправки заказа.

#### Класс ConfirmSuccess
Расширяет класс Component. Представляет контент модального окна подтвреждения сделанного заказа в случае успеха. Сохраняет копию шаблона соответствующего элемента и полученный обработчик событий и модель заказа для дальнейшей отправки.\

Поля класса:
- _orderSuccessDescriptionElement: HTMLParagraphElement; - описание отправки заказа.
- _orderSuccessBtnElement: HTMLButtonElement; - кнопка подтверждения.

Методы:
- set price(value: number) - сеттер цены заказа для описания подтверждения.

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
- `sendOrder` - отправка заказа на сервер.
- `initialData:loaded` - изначальная загрузка данных и её отображение.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `ui:basket-add` - добавляющее товар в модель корзины.
- `ui:basket-remove` - удаляющее товар в модель корзины.
- `modal:close` - закрывает модальное окно и сбрасывает данные о заказе.
- `modalPreview:open` - открытие модального окна товара.
- `modalBasket:open` - открытие модального окна с корзиной.
- `modalOrder:open` - открытие модального окна с формой заполнения заказа (2 фаза).
- `modalContacts:open` - открытие модального окна с формой заполнения заказа (3 фаза).
- `modalConfirmSuccess:open` - открытие модального окна с подтверждением об успешном заказе.
