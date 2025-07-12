import { EventEmitter } from '../base/events';
import { FormModel } from '../Model/FormModel';
import { Order } from '../View/FormOrder';
import { Contacts } from '../View/FormContacts';
import { ModalWindow } from '../View/ModalWindow';
import { BasketModel } from '../Model/BasketModel';
import { IOrderForm } from '../../types';

/** класс презентера заказа */
export class OrderPresenter {
  constructor(
    private formModel: FormModel,
    private orderView: Order,
    private contactsView: Contacts,
    private modal: ModalWindow,
    private basketModel: BasketModel,
    private events: EventEmitter
  ) {
    this.subscribe();
  }

  /** подписывается на события */
  private subscribe() {
    this.events.on('order:open', () => this.openOrder());
    this.events.on('order:paymentSelection', (button: HTMLButtonElement) => this.setPayment(button));
    this.events.on('order:changeAddress', (data: { field: string, value: string }) => this.setAddress(data));
    this.events.on('formErrors:address', (errors: Partial<IOrderForm>) => this.validateAddress(errors));
    this.events.on('contacts:open', () => this.openContacts());
    this.events.on('contacts:changeInput', (data: { field: string, value: string }) => this.setContacts(data));
    this.events.on('formErrors:change', (errors: Partial<IOrderForm>) => this.validateContacts(errors));
  }

  /** отрывает форму */
  private openOrder() {
    this.modal.content = this.orderView.render();
    this.modal.render();
    this.formModel.items = this.basketModel.basket.map(item => item.id);
  }

  /** устанавливает способ оплаты */
  private setPayment(button: HTMLButtonElement) {
    this.formModel.payment = button.name;
  }

  /** устанавливает адрес доставки в модель */
  private setAddress(data: { field: string, value: string }) {
    this.formModel.setOrderAddress(data.field, data.value);
  }

  /** валидирует адрес доставки и обновляет представление */
  private validateAddress(errors: Partial<IOrderForm>) {
    const { address, payment } = errors;
    this.orderView.valid = !address && !payment;
    this.orderView.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
  }

  /** открывает форму ввода контактных данных */
  private openContacts() {
    this.formModel.total = this.basketModel.getSumAllProducts();
    this.modal.content = this.contactsView.render();
    this.modal.render();
  }

  /** устанавливает контактные данные в модель */
  private setContacts(data: { field: string, value: string }) {
    this.formModel.setOrderData(data.field, data.value);
  }

  /** валидирует контактные данные и обновляет представление */
  private validateContacts(errors: Partial<IOrderForm>) {
    const { email, phone } = errors;
    this.contactsView.valid = !email && !phone;
    this.contactsView.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
  }
}