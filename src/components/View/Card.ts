import { IActions, ProductItem } from "../../types";
import { IEvents } from "../base/events";
import { formatPrice } from "../../utils/price";

/** интерфейс для карточки товара */
export interface ICard {
  render(data: ProductItem, isInBasket?: boolean): HTMLElement;
  updateBasketState(isInBasket: boolean): void;
}

/** базовый класс карточки товара */
export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _data: ProductItem;
  protected _category = <Record<string, string>>{
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  };
  
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  /** устанавливает текстовое содержимое элемента */
  protected setText(element: HTMLElement, value: unknown): void {
    if (element) {
      element.textContent = String(value);
    }
  }

  /** устанавливает категорию товара */
  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
    if (this._cardCategory) {
      this._cardCategory.className = `card__category card__category_${this._category[value]}`;
    }
  }

  /** обновляет состояние корзины */
  updateBasketState(isInBasket: boolean): void {
    if (this._cardPrice) {
      this._cardPrice.textContent = formatPrice(this._data?.price, isInBasket);
    }
    this._cardElement.classList.toggle('card_in-basket', isInBasket);
  }

  /** рендерит карточку товара */
  render(data: ProductItem, isInBasket: boolean = false): HTMLElement {
    this._data = data;
    this.cardCategory = data.category;
    this.setText(this._cardTitle, data.title);
    
    if (this._cardImage) {
      this._cardImage.src = data.image;
      this._cardImage.alt = data.title;
    }
    
    if (this._cardPrice) {
      this._cardPrice.textContent = formatPrice(data.price, isInBasket);
    }
    
    this._cardElement.classList.toggle('card_in-basket', isInBasket);
    
    return this._cardElement;
  }
}