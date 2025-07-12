import { ProductItem } from "../../types";
import { IEvents } from "../base/events";
import { BasketModel } from "./BasketModel";

export interface IDataModel {
  productCards: ProductItem[];
  selectedCard: ProductItem;
  setPreview(item: ProductItem): void;
}

export class DataModel implements IDataModel {

  /** список карточек товаров */
  protected _productCards: ProductItem[];

  /** выбранная карточка товара */
  selectedCard: ProductItem;

  /** модель корзины */
  basketModel: BasketModel;

  constructor(protected events: IEvents) {
    this._productCards = [];
  }

  setBasketModel(model: BasketModel) {
    this.basketModel = model;
  }

  /** обновляет список карточек товаров */
  set productCards(data: ProductItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  /** возвращает список карточек товаров */
  get productCards() {
    return this._productCards;
  }

  /** устанавливает выбранную карточку товара для модалки */
  setPreview(item: ProductItem) {
    this.selectedCard = item;
    this.events.emit('modalCard:open', item);
  }
}