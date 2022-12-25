import ProductDetails from './productDetails';
import Catalog from './catalog';
import { Types } from '../types/Types';

class AppView {
  productDetails: ProductDetails;
  catalog: Catalog;

  constructor() {
    this.productDetails = new ProductDetails();
    this.catalog = new Catalog();
  }

  showProductDetails(data: Types.Product) {
    this.productDetails.show(data);
  }
}

export default AppView;
