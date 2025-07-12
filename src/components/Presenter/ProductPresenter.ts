import { EventEmitter } from '../base/events';
import { DataModel } from '../Model/DataModel'; 
import { ModalWindow } from '../View/ModalWindow';
import { Card } from '../View/Card';
import { CardPreview } from '../View/CardPreview';
import { ProductItem } from '../../types';
import { ensureElement } from '../../utils/utils';

/** класс презентера отображения карточек товара*/
export class ProductPresenter {
  constructor(
    private model: DataModel,
    private modalWindow: ModalWindow,
    private events: EventEmitter,
    private cardCatalogTemplate: HTMLTemplateElement,
    private cardPreviewTemplate: HTMLTemplateElement
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
      ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
  }

  /** выбор карточки, показывает модалку */
  private selectCard(item: ProductItem) {
    this.model.setPreview(item);

    /** проверяет наличие товара в корзине */
    const isInBasket = this.model.basketModel.isCardInBasket(item);

    /** превью карточки*/
    const cardPreview = new CardPreview(this.cardPreviewTemplate, this.events);
    this.modalWindow.content = cardPreview.render(item, isInBasket);

    // Закрытие модалки при успешном добавлении/удалении
    const closeModalHandler = () => this.modalWindow.close();
    
    if (!isInBasket) {
        this.events.once('card:addBasket', closeModalHandler); // закрыть после добавления
    } else {
        this.events.once('card:removeBasket', closeModalHandler); // закрыть после удаления
    }
    
    this.modalWindow.render();
  }
}