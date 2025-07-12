import { ApiListResponse, Api } from '../base/api'
import { IOrderLot, IOrderResult, ProductItem } from '../../types';

/** класс модели API для работы с товарами */
export class ApiModel extends Api {
  cdn: string;
  items: ProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  /** получаем массив объектов(карточек) с сервера, добавляет CDN-префикс к URL изображений */
  getListProductCard(): Promise<ProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<ProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  /** получаем ответ от сервера по сделанному заказу */
  postOrderLot(order: IOrderLot): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}