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

  createFilterPrice(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
    const newData = data as Types.RootObject;
    const pricesArr = newData.products.map((product) => {
      return product.price;
    });

    const price = {
      min: Math.min(...pricesArr),
      max: Math.max(...pricesArr),
    };

    this.catalog.drawPrice(price, filtersDiv);
  }

  createFilterCaregories(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
    const categoriesDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
    const newData = data as string[];

    if (categoriesDiv) {
      newData.forEach((category) => {
        this.catalog.drawCategory(category, categoriesDiv);
      });
    }
  }

  createFilterBrands(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
    const brandsDiv: HTMLDivElement | null = filtersDiv.querySelector('.brands-filters');
    const newData = data as Types.RootObject;
    const brands = newData.products.map((product) => {
      return product.brand;
    });
    const uniqueBrands = [...new Set(brands)];

    if (brandsDiv) {
      uniqueBrands.forEach((brand) => {
        this.catalog.drawCategory(brand, brandsDiv);
      });
    }
  }

  // filterData(data, options) {

  // }

  createCatalog(data: Types.TypesOfData, catalogDiv: HTMLDivElement) {
    const newData = (data as Types.RootObject).products;
    // const filteredArr
    newData.forEach((card) => {
      this.catalog.drawCard(card, catalogDiv);
    });
  }
}

export default AppView;
