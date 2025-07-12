import { IEvents } from "../base/events";

/** интерфейс для формы контактов */
export interface IContacts {
  formContacts: HTMLFormElement; 
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

/** класс VIEW формы контактов */
export class Contacts implements IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit(`contacts:changeInput`, { field, value });
      })
    })

    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  /** устанавливает состояние валидности формы */
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  /** рендерит HTML элемент формы */
  render() {
    return this.formContacts
  }
}