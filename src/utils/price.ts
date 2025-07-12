/** форматирует цену для отображения */
export function formatPrice(value: number | null, isInBasket: boolean = false): string {
    if (value === null || isInBasket) {
      return 'Бесценно';
    }
    return `${value} синапсов`;
}