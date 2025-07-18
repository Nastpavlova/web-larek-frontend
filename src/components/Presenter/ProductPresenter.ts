import { EventEmitter } from '../base/events';
import { DataModel } from '../Model/DataModel'; 
import { ModalWindow } from '../View/ModalWindow';
import { Card } from '../View/Card';
import { CardPreview } from '../View/CardPreview';
import { ProductItem } from '../../types';
import { MainPage } from '../View/MainPage';

/** класс презентера отображения карточек товара*/
export class ProductPresenter {
  constructor(
    private model: DataModel,
    private modalWindow: ModalWindow,
    private events: EventEmitter,
    private cardCatalogTemplate: HTMLTemplateElement,
    private cardPreviewTemplate: HTMLTemplateElement,
    private page: MainPage
  ) {
    this.subscribe();
  }

  /** подписывается на события */
  private subscribe() {
    this.events.on('productCards:receive', () => this.renderCards());
    this.events.on('card:select', (item: ProductItem) => this.selectCard(item));
  }

  /** рендерит карточки товаров */
  private renderCards() {
    this.model.productCards.forEach(item => {
      const card = new Card(this.cardCatalogTemplate, this.events, {
        onClick: () => this.events.emit('card:select', item)
      });
      this.page.appendCard(card.render(item));
    });
  }

  /** выбор карточки, показывает модалку */
  private selectCard(item: ProductItem) {
    this.model.setPreview(item);

    /** проверяет наличие товара в корзине */
    const isInBasket = this.model.basketModel.isCardInBasket(item);

    /** превью карточки*/
    const cardPreview = new CardPreview(this.cardPreviewTemplate, this.events);
    this.modalWindow.content = cardPreview.render(item, this.model.basketModel.isCardInBasket(item));

    this.events.once('basket:updated', () => {
      this.modalWindow.close();
    });
  
    this.modalWindow.render();
  }
}