/** интерфейс данных товара */
export interface ProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** интерфейс обработчиков событий */
export interface IActions {
  onClick: (event: MouseEvent) => void;
}

/** интерфейс формы заказа */
export interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

/** интерфейс заказа */
export interface IOrder extends IOrderForm {
  items: string[];
}

/** интерфейс подтвержденного заказа */
export interface IOrderLot{
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

/** интерфейс результата заказа */
export interface IOrderResult {
  id: string;
  total: number;
}

/** тип ошибки формы */
export type FormErrors = Partial<Record<keyof IOrder, string>>;