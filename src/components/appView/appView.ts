import ProductDetails from './productDetails';
import Cart from './cart';
import Catalog from './catalog';
import { Types } from '../types/Types';

const PAGINATION_COUNT = 6;

class AppView {
  productDetails: ProductDetails;

  catalog: Catalog;

  cart: Cart;

  filteredArr: Types.Product[] = [];

  cartItems: Types.TCart;

  constructor() {
    this.cart = new Cart();
    this.cartItems = this.cart.cartItems;
    this.productDetails = new ProductDetails(this.cart);
    this.catalog = new Catalog();
  }

  showProductDetails(data: Types.Product) {
    this.productDetails.drawProduct(data);
  }

  createToggle() {
    this.catalog.addCardViewToggler();
  }

  createDropdown() {
    const dropdownSort = document.querySelector('.sort-dropdown');
    const dropdownMenu = document.querySelector('.sort-dropdown-items');
    dropdownSort?.addEventListener('click', () => {
      dropdownMenu?.classList.toggle('visible');
    });
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

  filterProducts(data: Types.Product[], filtersObj: Types.IFilters) {
    this.filteredArr = [];
    this.filteredArr = data.filter((product) => {
      if (filtersObj.categories.length > 0) {
        return filtersObj.categories.includes(product.category);
      } else {
        return true;
      }
    });

    this.filteredArr = this.filteredArr.filter((product) => {
      if (filtersObj.brands.length > 0) {
        return filtersObj.brands.includes(product.brand);
      } else {
        return true;
      }
    });

    this.filteredArr = this.filteredArr.filter(
      (product) => product.price >= filtersObj.price.min && product.price <= filtersObj.price.max
    );
    this.filteredArr = this.filteredArr.filter(
      (product) => product.stock >= filtersObj.stock.min && product.stock <= filtersObj.stock.max
    );
    this.filteredArr = this.filteredArr.filter(
      (product) =>
        Math.round(product.discountPercentage) >= filtersObj.discount.min && Math.round(product.discountPercentage) <= filtersObj.discount.max
    );
  }

  initPagesandFilter(products: Types.Product[],  filtersObj: Types.IFilters, catalogDiv: HTMLDivElement) {
    this.filterProducts(products, filtersObj);
    const pagesCount = Math.ceil(this.filteredArr.length / PAGINATION_COUNT);
    this.initPages(pagesCount);
    this.createCatalog(this.filteredArr, catalogDiv, 0);
    this.initSorting();
  }

  createCatalog(filteredArr: Types.Product[], catalogDiv: HTMLDivElement, page: number) {
    const startIdx = page * PAGINATION_COUNT;
    let endIdx = this.filteredArr.length >= PAGINATION_COUNT ? startIdx + PAGINATION_COUNT : this.filteredArr.length;
    if (endIdx > this.filteredArr.length) endIdx = this.filteredArr.length;
    catalogDiv.innerHTML = '';
    if (filteredArr.length == 0) {
      catalogDiv.innerHTML = `<div class='catalog-replacer'>No products found. Please try other filters.</div>`
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        this.catalog.drawCard(filteredArr[i], catalogDiv);
      }
    }
    // filteredArr.forEach((card) => {
    //   this.catalog.drawCard(card, catalogDiv);
    // });
    const productCards = document.querySelectorAll('.product-card');
    const productCardsDivsCart = document.querySelectorAll('.card-cart');
    if (productCardsDivsCart && productCards) {
      for (let i = 0, idx = startIdx; i < productCardsDivsCart.length; i++, idx++) {
        this.cart.initCartAdd(productCardsDivsCart[i], filteredArr[idx]);
      }
    }
  }

  initPages(pagesCount: number) {
    const catalogPages = <HTMLDivElement>document.querySelector('.catalog-pages');
    if (catalogPages) {
      if (pagesCount <= 0) {
        catalogPages.style.display = 'none';
      } else {
        catalogPages.style.display = 'flex';
        this.createPages(pagesCount);
      }
    }
  }

  createSortedCatalog() {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (catalogDiv) {
      const pagesCount = Math.ceil(this.filteredArr.length / PAGINATION_COUNT);
      this.initPages(pagesCount);
      this.createCatalog(this.filteredArr, catalogDiv, 0);
    }
  }

  initSorting() {
    const priceAsc = document.getElementById('price-asc');
    const priceDes = document.getElementById('price-des');
    const ratingAsc = document.getElementById('rating-asc');
    const ratingDes = document.getElementById('rating-des');
    priceAsc?.addEventListener('click', () => {
      this.filteredArr = this.filteredArr.sort((a, b) => {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      });
      this.createSortedCatalog();
    });
    priceDes?.addEventListener('click', () => {
      this.filteredArr = this.filteredArr.sort((a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      });
      this.createSortedCatalog();
    });
    ratingAsc?.addEventListener('click', () => {
      this.filteredArr = this.filteredArr.sort((a, b) => {
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        return 0;
      });
      this.createSortedCatalog();
    });
    ratingDes?.addEventListener('click', () => {
      this.filteredArr = this.filteredArr.sort((a, b) => {
        if (a.rating < b.rating) return -1;
        if (a.rating > b.rating) return 1;
        return 0;
      });
      this.createSortedCatalog();
    });
  }

  createPages(pagesCount: number) {
    const pagesWrapper = document.querySelector('.pages-wrapper');
    const pageNext = document.querySelector('.page-next');
    const pagePrev = document.querySelector('.page-prev');

    if (pagesWrapper) {
      pagesWrapper.innerHTML = '';
    }
    const pagesArr: HTMLDivElement[] = [];
    for (let i = 0; i < pagesCount; i++) {
      pagesArr.push(document.createElement('p'));
      pagesArr[i].className = 'catalog__page';
      pagesArr[i].className = 'page-idx';
      pagesArr[i].textContent = String(i + 1);
      pagesWrapper?.append(pagesArr[i]);
      pagesArr[i].addEventListener('click', () => {
        this.goToPage(pagesArr, i);
      });
    }
    pagesArr[0].classList.add('page-idx--active');
    pageNext?.addEventListener('click', () => {
      this.goToPage(pagesArr, this.findPageIdx(pagesArr) + 1);
    });
    pagePrev?.addEventListener('click', () => {
      this.goToPage(pagesArr, this.findPageIdx(pagesArr) - 1);
    });
  }

  goToPage(pagesArr: HTMLDivElement[], idx: number) {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (idx >= 0 && idx < pagesArr.length) {
      for (let i = 0; i < pagesArr.length; i++) {
        pagesArr[i].classList.remove('page-idx--active');
      }
      pagesArr[idx].classList.add('page-idx--active');
      if (catalogDiv) {
        this.createCatalog(this.filteredArr, catalogDiv, idx);
      }
    }
  }

  findPageIdx(pagesArr: HTMLDivElement[]) {
    for (let i = 0; i < pagesArr.length; i++) {
      if (pagesArr[i].classList.contains('page-idx--active')) return i;
    }
    return 0;
  }

  createCart() {
    this.cart.initPagesandCart();
  }
}

export default AppView;
