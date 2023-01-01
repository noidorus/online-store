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

  createFilterCaregories(data: Types.RootObject, filtersDiv: HTMLDivElement) {
    const categoriesDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
    const newData = data.toString().split(',');
    if (categoriesDiv) {
      newData.forEach((category) => {
        this.catalog.drawCategory(category, categoriesDiv);
      });
    }
  }

  createCatalog(data: Types.RootObject, catalogDiv: HTMLDivElement) {
    const newData = data as Types.RootObject;
    newData.products.forEach((card) => {
      this.catalog.drawCard(card, catalogDiv);
    });

    const productCards = document.querySelectorAll('.product-card');
    const productCardsDivsCart = document.querySelectorAll('.card-cart');
    if (productCardsDivsCart && productCards) {
      for (let i = 0; i < productCardsDivsCart.length; i++) {
        this.cart.initCartAdd(productCardsDivsCart[i], data.products[i]);
      }
    }
  }

  createCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.cart.fillCart();
    }
  }

  // createFilterBrands(data: Types.TypesOfData, filtersDiv: HTMLDivElement) {
  //   const brandsDiv: HTMLDivElement | null = filtersDiv.querySelector('.category-filters');
  //   console.log('brandsDiv: ', brandsDiv);
  // }
}

export default AppView;
