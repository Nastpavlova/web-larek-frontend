import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

/** интерфейс для работы с корзиной товаров*/
export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  items: HTMLElement[]; 
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}

/** класс для работы с корзиной товаров */
export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    
    // назначаем обработчики
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.items = [];
  }

  /** устанавливает товары в корзину */
  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  /** отображает общую сумму товаров*/
  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }

  /** рендерит корзину */
  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}