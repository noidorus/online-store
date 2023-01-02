import ProductDetails from './productDetails';
import Cart from './cart';
import Catalog from './catalog';
import { Types } from '../types/Types';

class AppView {
  productDetails: ProductDetails;

  catalog: Catalog;

  cart: Cart;

  constructor() {
    this.cart = new Cart();
    this.productDetails = new ProductDetails(this.cart);
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
    return filterCategory;
  }

  createCatalog(data: Types.TypesOfData, catalogDiv: HTMLDivElement, filtersObj: Types.IFilters) {
    const products = (data as Types.RootObject).products;
    const filteredArr = this.filterProducts(products, filtersObj);
    console.log('filteredArr: ', filteredArr);
    filteredArr.forEach((card) => {
      this.catalog.drawCard(card, catalogDiv);
    });

    const productCards = document.querySelectorAll('.product-card');
    const productCardsDivsCart = document.querySelectorAll('.card-cart');
    if (productCardsDivsCart && productCards) {
      for (let i = 0; i < productCardsDivsCart.length; i++) {
        this.cart.initCartAdd(productCardsDivsCart[i], products[i]);
      }
    }
  }

  createCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.cart.fillCart();
    }
  }
}

export default AppView;
