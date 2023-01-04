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

  createCheckFilters(data: Types.Product[], type: string) {
    const filterDiv = <HTMLDivElement>document.querySelector(`.${type}-filters`);
    let filters: string[] = [];
    if (type == 'brand') {
      filters = data.map((product) => {
        return product.brand;
      });
    }
    if (type == 'category') {
      filters = data.map((product) => {
        return product.category;
      });
    }
    const uniqueFilters = [...new Set(filters)];
    if (filterDiv) {
      uniqueFilters.forEach((filter) => {
        this.catalog.drawCategory(filter, filterDiv, type);
      });
    }
  }

  createPriceFilters(data: Types.Product[], filtersObj: Types.IFilters) {
    const filterArr = data.map((product) => product.price);

    const price = {
      min: Math.min(...filterArr),
      max: Math.max(...filterArr),
    };
    filtersObj.price = price;

    this.catalog.drawSliderFilter(price, 'price');
  }

  createStockFilters(data: Types.Product[], filtersObj: Types.IFilters) {
    const filterArr = data.map((product) => product.stock);

    const stock = {
      min: Math.min(...filterArr),
      max: Math.max(...filterArr),
    };
    filtersObj.stock = stock;

    this.catalog.drawSliderFilter(stock, 'stock');
  }

  createDiscountFilters(data: Types.Product[], filtersObj: Types.IFilters) {
    const filterArr = data.map((product) => product.discountPercentage);

    const discount = {
      min: Math.round(Math.min(...filterArr)),
      max: Math.round(Math.max(...filterArr)),
    };
    filtersObj.discount = discount;

    this.catalog.drawSliderFilter(discount, 'discount');
  }

  filterProducts(data: Types.Product[], filtersObj: Types.IFilters): Types.Product[] {
    let filteredProductArr = [];
    filteredProductArr = data.filter((product) => {
      if (filtersObj.categories.length > 0) {
        return filtersObj.categories.includes(product.category);
      } else {
        return true;
      }
    });

    filteredProductArr = filteredProductArr.filter((product) => {
      if (filtersObj.brands.length > 0) {
        return filtersObj.brands.includes(product.brand);
      } else {
        return true;
      }
    });
    

    filteredProductArr = filteredProductArr.filter(
      (product) => product.price >= filtersObj.price.min && product.price <= filtersObj.price.max
    );
    filteredProductArr = filteredProductArr.filter(
      (product) => product.stock >= filtersObj.stock.min && product.stock <= filtersObj.stock.max
    );
    filteredProductArr = filteredProductArr.filter(
      (product) =>
        product.discountPercentage >= filtersObj.discount.min && product.discountPercentage <= filtersObj.discount.max
    );

    return filteredProductArr;
  }

  createCatalog(products: Types.Product[], catalogDiv: HTMLDivElement, filtersObj: Types.IFilters) {
    const filteredArr = this.filterProducts(products, filtersObj);
    console.log(filteredArr);
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

  goToPage() {
    
  }

  createCart() {
    this.cart.fillCart();
  }
}

export default AppView;
