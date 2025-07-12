import { ProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface IDataModel {
  productCards: ProductItem[];
  selectedСard: ProductItem;
  setPreview(item: ProductItem): void;
}

export class DataModel implements IDataModel {

  /** список карточек товаров */
  protected _productCards: ProductItem[];

  /** выбранная карточка товара */
  selectedСard: ProductItem;

  constructor(protected events: IEvents) {
    this._productCards = [];
  }

  /** обновляет список карточек товаров и генерирует событие 'productCards:receive' */
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
    this.selectedСard = item;
    this.events.emit('modalCard:open', item);
  }
}