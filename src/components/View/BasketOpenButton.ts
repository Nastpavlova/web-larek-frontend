import { IEvents } from "../base/events";

/** Интерфейс для кнопки открытия корзины */
export interface IBasketOpenButton {
  button: HTMLButtonElement;
  counter: HTMLElement;
  updateCounter(value: number): void;
}

/** Класс для кнопки открытия корзины */
export class BasketOpenButton implements IBasketOpenButton {
  button: HTMLButtonElement;
  counter: HTMLElement;

  constructor(protected events: IEvents) {
    this.button = document.querySelector('.header__basket');
    this.counter = document.querySelector('.header__basket-counter');
    
    this.button.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
    
    this.events.on('basket:updated', (data: {count: number}) => {
      this.updateCounter(data.count);
    });
        
    this.events.on('basket:change', (data: {count: number}) => {
      this.updateCounter(data.count);
    });
  }

  /** Обновляет счетчик товаров */
  updateCounter(value: number) {
    this.counter.textContent = String(value);
  }
}