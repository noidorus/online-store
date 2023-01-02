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

  createToggle() {
    this.catalog.addCardViewToggler();
  }

  createFilterPrice(data: Types.TypesOfData, filtersDiv: HTMLDivElement, filtersObj: Types.IFilters) {
    const newData = data as Types.RootObject;
    const pricesArr = newData.products.map((product) => {
      return product.price;
    });

    const price = {
      min: Math.min(...pricesArr),
      max: Math.max(...pricesArr),
    };
    filtersObj.price = price;

    this.catalog.drawPrice(price, filtersDiv);
  }

  createFilterCaregories(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
    const categoriesDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
    const newData = data as string[];

    if (categoriesDiv) {
      newData.forEach((category) => {
        this.catalog.drawCategory(category, categoriesDiv, 'categories');
      });
    }
  }

  createFilterBrands(data: Types.TypesOfData, filtersDiv: HTMLDivElement, filtersObj: Types.IFilters) {
    const brandsDiv: HTMLDivElement | null = filtersDiv.querySelector('.brands-filters');
    const newData = (data as Types.RootObject).products;
    const brands = newData.map((product) => {
      return product.brand;
    });
    const uniqueBrands = [...new Set(brands)];

    filtersObj.brands = uniqueBrands;
    if (brandsDiv) {
      uniqueBrands.forEach((brand) => {
        this.catalog.drawCategory(brand, brandsDiv, 'brands');
      });
    }
  }

  filterProducts(data: Types.Product[], filtersObj: Types.IFilters): Types.Product[] {
    const filterCategory = data.filter((product) => {
      if (filtersObj.categories) {
        if (filtersObj.categories.length > 0) {
          return filtersObj.categories.some((category) => category === product.category);
        } else {
          return true;
        }
      }
    });

    console.log('filteredData: ', filterCategory);
    return filterCategory;
  }

  createCatalog(data: Types.TypesOfData, catalogDiv: HTMLDivElement, filtersObj: Types.IFilters) {
    const newData = (data as Types.RootObject).products;
    const filteredArr = this.filterProducts(newData, filtersObj);

    filteredArr.forEach((card) => {
      this.catalog.drawCard(card, catalogDiv);
    });
  }
}

export default AppView;
