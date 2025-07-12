import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

/** интерфейс главной страницы */
export interface IMainPage {
    render(): HTMLElement;
    setCounter(value: number): void;
    appendCard(cardElement: HTMLElement): void;
}

/** класс View главной страницы */
export class MainPage implements IMainPage {
    protected element: HTMLElement;
    protected counterElement: HTMLElement;
    protected galleryElement: HTMLElement;

    constructor(protected events: IEvents) {
        this.element = ensureElement<HTMLElement>('.page__wrapper');
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');
        this.galleryElement = ensureElement<HTMLElement>('.gallery');
    }

    /** обновляем счетчик товаров */
    setCounter(value: number): void {
        this.counterElement.textContent = String(value);
    }

    /** добавляем карточку товара в галерею */
    appendCard(cardElement: HTMLElement): void {
        this.galleryElement.append(cardElement);
    }

    /** рендерим страницу */
    render(): HTMLElement {
        return this.element;
    }
}