import { EventEmitter } from '../base/events';
import { BasketModel } from '../Model/BasketModel';
import { Basket } from '../View/Basket';
import { BasketItem } from '../View/BasketItem';
import { BasketOpenButton } from '../View/BasketOpenButton';
import { ModalWindow } from '../View/ModalWindow';
import { DataModel } from '../Model/DataModel';
import { ProductItem } from '../../types';

/** класс презентера корзины товаров */
export class BasketPresenter {
  constructor(
    private basketModel: BasketModel,
    private basketView: Basket,
    private basketOpenButton: BasketOpenButton,
    private modal: ModalWindow,
    private dataModel: DataModel,
    private events: EventEmitter,
    private cardBasketTemplate: HTMLTemplateElement
  ) {
    this.subscribe();
  }

  /** подписывается на события */
  private subscribe() {
    this.events.on('basket:open', () => this.openBasket());
    this.events.on('basket:basketItemRemove', (item: ProductItem) => this.removeItem(item));
    this.events.on('basket:add', (item: ProductItem) => {
      this.basketModel.addCardToBasket(item);
      this.updateBasket();
      this.events.emit('basket:changed', item);
    });
  
    this.events.on('basket:remove', (item: ProductItem) => {
      this.basketModel.deleteCardToBasket(item);
      this.updateBasket();
      this.events.emit('basket:changed', item);
    });
  }

    private updateBasket() {
      this.updateBasketCounter(this.basketModel.getQuantity());
      this.events.emit('basket:updated', {
        count: this.basketModel.getQuantity(),
        sum: this.basketModel.getSumAllProducts()
      });
    }

  /** Обновляет счетчик товаров в шапке */
  private updateBasketCounter(count: number): void {
    this.basketOpenButton.updateCounter(count);
  }

  /** открывает модальное окно корзины */
  private openBasket(): void {
      this.updateBasketTotal();
      this.renderBasketItems();
      this.showBasketModal();
  }

  /** обновляет отображение общей суммы в корзине */
  private updateBasketTotal(): void {
      const sum = this.basketModel.getSumAllProducts();
      this.basketView.renderSumAllProducts(sum);
  }

  /** рендерит список товаров в корзине */
  private renderBasketItems(): void {
      this.basketView.items = this.basketModel.basket.map((item, index) => 
          this.createBasketItem(item, index + 1)
      );
  }

  /** рендерит DOM-элемент для товара в корзине */
  private createBasketItem(item: ProductItem, index: number): HTMLElement {
      const basketItem = new BasketItem(this.cardBasketTemplate, this.events, {
          onClick: () => this.events.emit('basket:basketItemRemove', item)
      });
      return basketItem.render(item, index);
  }

  /** показывает модальное окно корзины */
  private showBasketModal(): void {
      this.modal.content = this.basketView.render();
      this.modal.render();
  }

  /** удаляет товар из корзины */
  private removeItem(item: ProductItem) {
    this.basketModel.deleteCardToBasket(item);
    this.basketOpenButton.updateCounter(this.basketModel.getQuantity());
    this.events.emit('basket:change', {
        count: this.basketModel.getQuantity(),
        sum: this.basketModel.getSumAllProducts()
    });
    this.openBasket();
  }
}