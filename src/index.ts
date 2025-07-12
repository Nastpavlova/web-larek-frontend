import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductItem } from './types';
import { ensureElement } from './utils/utils';

// инициализация model
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { BasketModel } from './components/Model/BasketModel';
import { FormModel } from './components/Model/FormModel';

// инициализация view
import { Basket } from './components/View/Basket';
import { BasketOpenButton } from './components/View/BasketOpenButton';
import { ModalWindow } from './components/View/ModalWindow';
import { Order } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { MainPage } from './components/View/MainPage';

// инициализация презентеров
import { ProductPresenter } from './components/Presenter/ProductPresenter';
import { BasketPresenter } from './components/Presenter/BasketPresenter';
import { OrderPresenter } from './components/Presenter/OrderPresenter';
import { SuccessPresenter } from './components/Presenter/SuccessPresenter';
import { MainPagePresenter } from './components/Presenter/MainPagePresenter';

// шаблоны
const templates = {
  cardCatalog: document.querySelector('#card-catalog') as HTMLTemplateElement,
  cardPreview: document.querySelector('#card-preview') as HTMLTemplateElement,
  basket: document.querySelector('#basket') as HTMLTemplateElement,
  cardBasket: document.querySelector('#card-basket') as HTMLTemplateElement,
  order: document.querySelector('#order') as HTMLTemplateElement,
  contacts: document.querySelector('#contacts') as HTMLTemplateElement,
  success: document.querySelector('#success') as HTMLTemplateElement
};

// инициализация компонентов
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const page = new MainPage(events);
const dataModel = new DataModel(events);
const modalWindow = new ModalWindow(ensureElement<HTMLElement>('#modal-container'), events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const mainPage = new MainPage(events);

dataModel.setBasketModel(basketModel);

// view
const basket = new Basket(templates.basket, events);
const basketOpenButton = new BasketOpenButton(events);
const order = new Order(templates.order, events);
const contacts = new Contacts(templates.contacts, events);

// презентеры

new MainPagePresenter(
  events, 
  mainPage, 
  basketModel
).initialize();

new ProductPresenter(
  dataModel,
  modalWindow,
  events,
  templates.cardCatalog,
  templates.cardPreview,
  mainPage
);

new BasketPresenter(
  basketModel,
  basket,
  basketOpenButton,
  modalWindow,
  dataModel,
  events,
  templates.cardBasket
);

new OrderPresenter(
  formModel,
  order,
  contacts,
  modalWindow,
  basketModel,
  events
);

new SuccessPresenter(
  apiModel,
  formModel,
  basketModel,
  modalWindow,
  events,
  templates.success,
);

// обработчики модального окна
events.on('modal:open', () => modalWindow.locked = true);
events.on('modal:close', () => modalWindow.locked = false);

// загрузка данных о товарах с сервера
apiModel.getListProductCard()
  .then((data: ProductItem[]) => {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error));