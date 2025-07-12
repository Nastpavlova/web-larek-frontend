import { Card } from "./Card";
import { IActions, ProductItem } from "../../types";
import { IEvents } from "../base/events";
import { formatPrice } from "../../utils/price";

/** класс VIEW превью карточки товара */
export class CardPreview extends Card {
  protected readonly textElement: HTMLElement;
  protected readonly buttonElement: HTMLButtonElement;
  protected _data: ProductItem;
  protected readonly buttonText = {
    available: 'Купить',
    unavailable: 'Недоступно',
    inBasket: 'Удалить из корзины'
  };

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.textElement = this._cardElement.querySelector('.card__text');
    this.buttonElement = this._cardElement.querySelector('.card__button') as HTMLButtonElement;
    this.buttonElement.addEventListener('click', () => {
      if (this._cardElement.classList.contains('card_in-basket')) {
        this.events.emit('basket:remove', this._data);
      } else {
        this.events.emit('basket:add', this._data);
      }
    });    
  }
  
  /** обновляет состояние кнопки */
  updateButtonState(isInBasket: boolean): void {
    this.buttonElement.textContent = isInBasket 
      ? this.buttonText.inBasket 
      : this.getButtonText(this._data);
    
    this._cardElement.classList.toggle('card_in-basket', isInBasket);
    this._cardPrice.textContent = isInBasket ? 'Бесценно' : formatPrice(this._data.price);
  }

  /** текст для кнопки по наличию цены */
  private getButtonText(data: ProductItem): string {
    if (!data.price) {
      this.buttonElement.disabled = true;
      return this.buttonText.unavailable;
    }
    this.buttonElement.disabled = false;
    return this.buttonText.available;
  }

  /** рендерит превью карточки */
  render(data: ProductItem, isInBasket: boolean = false): HTMLElement {
    super.render(data, isInBasket);
    this._data = data;
    this.textElement.textContent = data.description;
    this.updateButtonState(isInBasket);
    return this._cardElement;
  }
}