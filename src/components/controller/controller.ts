import AppLoader from './appLoader';
import { Types } from '../types/Types';

export default class AppController extends AppLoader {
  getProducts(callback: Types.CallBackType, options: Types.IOptions = {}) {
    super.getResp(callback, options);
  }

  getProductDetails(callback: Types.TProductCallback, options: Types.IOptions = {}) {
    // Show Product Details
    super.getResp(callback, options);
  }

  getCategories(callback: Types.CallBackType) {
    super.getResp(callback, {
      endpoint: Types.Endpoint.CATEGORIES,
    });
  }
}
