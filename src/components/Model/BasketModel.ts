import { ProductItem } from "../../types";

/** интерфейс модели корзины товаров */
export interface IBasketModel {
  basket: ProductItem[];
  getQuantity: () => number;
  getSumAllProducts: () => number;
  addCardToBasket(data: ProductItem): void;
  deleteCardToBasket(item: ProductItem): void;
  clearBasket(): void
  isCardInBasket(data: ProductItem): boolean;
}

export class BasketModel implements IBasketModel {

  /** список товаров в корзине */
  protected _basket: ProductItem[];

  constructor() {
    this._basket = [];
  }

  /** устанавливает список товаров в корзине */
  set basket(data: ProductItem[]) {
    this._basket = data;
  }

  /** возвращает список товаров в корзине */
  get basket() {
    return this._basket;
  }

  /** количество товара в корзине */
  getQuantity() {
    return this.basket.length;
  }

  /** сумма товаров в корзине */
  getSumAllProducts() {
    let sumAll = 0;
    this.basket.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  /** проверить, есть ли товар в корзине */
  isCardInBasket(data: ProductItem): boolean {
    return this._basket.some(basketItem => basketItem.id === data.id);
  }

  /** добавить карточку товара в корзину */
  addCardToBasket(data: ProductItem) {
    if (!this.isCardInBasket(data)) {
      this._basket.push(data);
    }
  }

  /** удалить карточку товара из корзины */
  deleteCardToBasket(item: ProductItem) {
    const index = this._basket.indexOf(item);
    if (index >= 0) {
      this._basket.splice(index, 1);
    }
  }

  /** очистить корзину */
  clearBasket() {
    this.basket = []
  }
}