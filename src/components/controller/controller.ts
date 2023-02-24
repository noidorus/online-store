import AppLoader from './appLoader';
import { Types } from '../types/Types';

export default class AppController extends AppLoader {
  getProducts(callback: Types.CallBackType, options: Types.IOptions = {}): void {
    super.getResp(callback, options);
  }

  getProductDetails(callback: Types.TProductCallback, options: Types.IOptions = {}): void {
    // Show Product Details
    super.getResp(callback, options);
  }

  getCategories(callback: Types.CallBackType): void {
    super.getResp(callback, {
      endpoint: Types.Endpoint.CATEGORIES,
    });
  }

  getSearchResults(searchString: string, callback: Types.CallBackType): void {
    super.getResp(callback, {
      endpoint: Types.Endpoint.SEARCH,
      search: searchString,
    });
  }
}
