import { EventEmitter } from "../base/events";
import { MainPage } from "../View/MainPage";
import { BasketModel } from "../Model/BasketModel";

export class MainPagePresenter {
    constructor(
        protected events: EventEmitter,
        protected page: MainPage,
        protected basketModel: BasketModel
    ) {
        this.subscribe();
    }

    private subscribe() {
        this.events.on('basket:updated', () => {
            this.page.setCounter(this.basketModel.getQuantity());
        });

        this.events.on('basket:change', () => {
            this.page.setCounter(this.basketModel.getQuantity());
        });
    }

    /** Инициализация главной страницы */
    initialize() {
        this.page.setCounter(this.basketModel.getQuantity());
        return this.page.render();
    }
}