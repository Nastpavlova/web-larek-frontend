import { Card } from "./Card";
import { IActions, ProductItem } from "../../types";
import { IEvents } from "../base/events";

/** класс VIEW превью карточки товара */
export class CardPreview extends Card {
  protected readonly textElement: HTMLElement;
  protected readonly buttonElement: HTMLElement;
  protected readonly buttonText = {
    available: 'Купить',
    unavailable: 'Не продается'
  };

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.textElement = this._cardElement.querySelector('.card__text');
    this.buttonElement = this._cardElement.querySelector('.card__button');
    this.buttonElement.addEventListener('click', () => { this.events.emit('card:addBasket') });
  }
  
  /** текст для кнопки по наличию цены + состояние кнопки */
  getButtonText(data: ProductItem) {
    if (data.price) {
      this.buttonElement.removeAttribute('disabled');
      return this.buttonText.available;
    } else {
      this.buttonElement.setAttribute('disabled', 'true');
      return this.buttonText.unavailable;
    }
  }

  /** рендерит превью карточки */
  render(data: ProductItem): HTMLElement {
    super.render(data);
    this.textElement.textContent = data.description;
    this.buttonElement.textContent = this.getButtonText(data);
    return this._cardElement;
  }
}