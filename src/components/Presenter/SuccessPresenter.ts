import { EventEmitter } from '../base/events';
import { ApiModel } from '../Model/ApiModel';
import { FormModel } from '../Model/FormModel';
import { BasketModel } from '../Model/BasketModel';
import { ModalWindow } from '../View/ModalWindow';
import { Success } from '../View/Success';

/** класс презентера успешного оформления заказа */
export class SuccessPresenter {
  constructor(
    private apiModel: ApiModel,
    private formModel: FormModel,
    private basketModel: BasketModel,
    private modal: ModalWindow,
    private events: EventEmitter,
    private successTemplate: HTMLTemplateElement,
  ) {
    this.subscribe();
  }

  /** подписывается на события */
  private subscribe() {
    this.events.on('success:open', () => this.openSuccess());
    this.events.on('success:close', () => this.closeSuccess());
  }

  /** отрывает модалку успешного оформления заказа */
  private openSuccess() {
    const total = this.basketModel.getSumAllProducts();
    const items = this.basketModel.basket.map(item => item.id);

    this.apiModel.postOrderLot(this.formModel.getOrderLot(total, items))
      .then((data) => {
        const success = new Success(this.successTemplate, this.events);
        this.modal.content = success.render(total);
        this.basketModel.clearBasket();
        this.events.emit('basket:change', {count: this.basketModel.getQuantity() });
        this.modal.render();
      })
      .catch(error => console.log(error));
  }

  /** закрывает модалку успешного заказа */
  private closeSuccess() {
    this.modal.close();
  }
}