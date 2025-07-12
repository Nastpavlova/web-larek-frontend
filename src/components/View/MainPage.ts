import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

/** Интерфейс главной страницы */
export interface IMainPage {
    render(): HTMLElement;
    setCounter(value: number): void;
}

/** Класс представления главной страницы */
export class MainPage implements IMainPage {
    protected element: HTMLElement;
    protected counterElement: HTMLElement;

    constructor(protected events: IEvents) {
        this.element = ensureElement<HTMLElement>('.page__wrapper');
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');
    }

    /** Обновляет счетчик товаров */
    setCounter(value: number): void {
        this.counterElement.textContent = String(value);
    }

    /** Рендерит страницу */
    render(): HTMLElement {
        return this.element;
    }
}