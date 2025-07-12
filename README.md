# Проектная работа "Веб-ларек"

### Используемые технологии: 
```
HTML, SCSS, TS, Webpack
```

### Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

### Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

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

## Данные и типы данных

### Карточка товара:

```
interface ProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

### Интерфейс модели корзины товаров:

```
interface IBasketModel {
  basket: ProductItem[];
  getQuantity: () => number;
  getSumAllProducts: () => number;
  addCardToBasket(data: ProductItem): void;
  deleteCardToBasket(item: ProductItem): void;
  clearBasket(): void
}
```

## Архитектура приложения
Проект использует архитектурный подход `MVP (Model-View-Presenter)` с разделением на три слоя (в проекте отдельные это папки соответственно):
- `Model (слой данных)` - хранение и изменение данных
- `View (слой представления)` - интерфейс для взаимодействия с пользователем
- `Presenter (презентер)` - связавает View и Model

# Базовый код

## `Класс Api`: 

Содержит логику отправки запросов на сервер.

#### Конструктор принимает: 
- `baseUrl: string` - адрес сервера
- `options: RequestInit = {}` - опциональные параметры запроса


#### Методы:
- `get(url: string)` - выполняет GET запрос
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - выполняет POST-запрос

## `Класс EventEmitter`: 

#### Класс EventEmitter
Представляет брокер событий, который позволяет отправлять события и подписываться на события.


#### Методы:
- `оn` - установить обработчик на событие
- `off` - снять обработчик с события
- `emit` - инициализация события с данными
- `onAll` - слушать все события
- `offAll` - cросить все обработчики
- `trigger` - сделать коллбек триггер, генерирующий событие при вызове

# Слой Model

## `Класс ApiModel`:
Расширяет базовый класс Api и предоставляет методы для работы с API товаров и заказов.

#### Конструктор принимает: 

- `cdn: string` - URL CDN
- `baseUrl: string` - базовый URL API
- `options?: RequestInit` - настройки для HTTP-запросов

#### Методы:
- `getListProductCard()` - получает список товаров с сервера через GET-запрос, добавляет CDN-префикс к URL изображений каждого товара, возвращает массив измененных товаров (ProductItem[])
- `postOrderLot(order: IOrderLot)` - отправляет данные заказа (IOrderLot) на сервер через POST-запрос, возвращает результат заказа (IOrderResult)

## `Класс BasketModel`:
Реализует интерфейс IBasketModel. Содержит логику работы с корзиной.

#### Конструктор: 
Инициализирует пустую корзину

#### Геттер/сеттер:
- `get basket()` - возвращает текущий список товаров
- `set basket(data: ProductItem[])` - обновляет список товаров

#### Методы:
- `getQuantity()` - возвращает количество товаров в корзине
- `getSumAllProducts()` - возвращает сумму товаров в корзине
- `addCardToBasket(data: ProductItem)` - добавляет карточку товара в корзину
- `deleteCardToBasket(item: ProductItem)` - удаляет карточку товара из корзины
- `clearBasket()` - очищает корзину

## `Класс DataModel`:
Реализует интерфейс IDataModel. Модель данных управляет списком товаров, выбранным товаром для предпросмотра, взаимодействует событиями, уведомляя об изменениях. 

#### Конструктор принимает: 
- `protected events: IEvents` - систему событий

#### Геттер/сеттер:
- `get productCards()` - возвращает список карточек товаров
- `set productCards(data: ProductItem[])` - обновляет список карточек товаров и генерирует событие 'productCards:receive'

#### Методы:
- `setPreview(item: ProductItem)` - устанавливает выбранную карточку товара для модалки и генерирует событие 'modalCard:open' с переданным товаром для открытия модального окна

## `Класс FormModel`:
Реализует интерфейс IFormModel.

#### Конструктор принимает: 
- `protected events: IEvents` - систему событий

#### Методы:
- `setOrderAddress(field: string, value: string)` - устанавливает значение строки "address", проверяет валидность через метод validateOrder, если валидно, то генерирует событие 'order:ready'
- `validateOrder()` - проверяет валидность адреса, при ошибках генерирует вобытие 'formErrors:address'
- `setOrderData(field: string, value: string)` - устанавливает значение строк "Email" и "Телефон", проверяет валидность через метод validateContacts, если валидно, то генерирует событие 'order:ready'
- `validateContacts()` - проверяет валидность "Email" и "Телефон", при ошибках генерирует вобытие 'formErrors:change'
- `getOrderLot()` - возвращает объект с данными заказа

# Слой View:

## `Класс Basket`:
Реализует интерфейс IBasket.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон корзины
- `protected events: IEvents` - систему событий

#### Геттер/сеттер:
- `set items(items: HTMLElement[])` - обновляет список товаров в корзине. Если корзина пуста - блокирует кнопку оформления и показывает сообщение

#### Методы:
- `renderHeaderBasketCounter(value: number)` - обновляет счетчик товаров в шапке сайта
- `renderSumAllProducts(sumAll: number)` - отображает общую сумму товаров
- `render()` - рендерит корзину

## `Класс BasketItem`:
Реализует интерфейс IBasketItem. Класс отображает визуал одного товара в корзине.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон элемента корзины
- `protected events: IEvents` - систему событий
- `actions?: IActions` - объект с действиями

#### Методы:
- `protected setPrice(value: number | null)` - форматирует цену
- `render(data: ProductItem, item: number)` - рендерит элемент товара в корзине

## `Класс Card`:
Реализует интерфейс ICard.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон карточки
- `protected events: IEvents` - систему событий
- `actions?: IActions` - объект с действиями

#### Геттер/сеттер:
- `set cardCategory(value: string)` - устанавливает категорию товара и CSS

#### Методы:
- `protected setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое элемента
- `protected setPrice(value: number | null)` - форматирует цену для отображения
- `render(data: ProductItem)` - рендерит карточку товара

## `Класс CardPreview`:
Расширяет Card.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон карточки
- `protected events: IEvents` - систему событий
- `actions?: IActions` - объект с действиями

#### Методы:
- `getButtonText(data: ProductItem)` - устанавливает текст для кнопки по наличию цены + состояние кнопки
- `render(data: ProductItem)` - рендерит превью карточки

## `Класс Contacts`:
Реализует интерфейс IContacts.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон формы
- `protected events: IEvents` - систему событий

#### Геттер/сеттер:
- `set valid(value: boolean)` - устанавливает состояние валидности формы

#### Методы:
- `render()` - рендерит HTML элемент формы

## `Класс Order`:
Реализует интерфейс IMainOrder.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон формы
- `protected events: IEvents` - систему событий

#### Геттер/сеттер:
- `set paymentSelection(paymentMethod: string)` - меняет класс для выбранного способа оплаты
- `set valid(value: boolean)` - устанавливает состояние валидности формы

#### Методы:
- `render()` - рендерит форму заказа

## `Класс ModalWindow`:
Реализует интерфейс IModalWindow.

#### Конструктор принимает:
- `template: HTMLTemplateElement` - шаблон модалки
- `protected events: IEvents` - систему событий

#### Геттер/сеттер:
- `set content(value: HTMLElement)` - заменяет содержимое модального окна
- `set locked(value: boolean)` - блокирует/разблокирует скролл страницы

#### Методы:
- `open()` - открытие модального окна
- `close()` - закрытие модального окна
- `render()` - рендерит окно

# Список событий
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `success:close` - закрытие окна успешного действия
- `success:open` - открытие окна успешного действия
- `order:open` - открытие формы заказа
- `order:ready` - заказ готов к оформлению
- `order:paymentSelection` - выбор способа оплаты
- `order:changeAddress` - изменение адреса доставки
- `formErrors:address` - ошибки валидации адреса
- `formErrors:change` - ошибки валидации контактов
- `contacts:open` - открытие формы контактов
- `contacts:changeInput` - изменение контактных данных
- `card:addBasket` - добавление карточки в корзину
- `card:select` - выбор карточки для открытия в модальном окне
- `productCards:receive` - получение списка товаров
- `basket:open` - открытие модального окна с корзиной
- `basket:basketItemRemove` - удаление из корзины