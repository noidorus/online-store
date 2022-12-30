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
    this.productDetails.drawProduct(data);
  }

  createFilterCaregories(data: Types.RootObject, filtersDiv: HTMLDivElement) {
    const categoriesDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
    const newData = data.toString().split(',');

    if (categoriesDiv) {
      newData.forEach((category) => {
        this.catalog.drawCategory(category, categoriesDiv);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCatalog(data: Types.RootObject, catalogDiv: HTMLDivElement) {
    const newData = data as Types.RootObject;
    newData.products.forEach((card) => {
      this.catalog.drawCard(card, catalogDiv);
    });
  }

  // createFilterBrands(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
  //   const brandsDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
  //   console.log('brandsDiv: ', brandsDiv);
  // }
}

export default AppView;
