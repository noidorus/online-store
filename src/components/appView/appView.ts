import ProductDetails from './productDetails';
import Cart from './cart';
import Catalog from './catalog';
import { Types } from '../types/Types';

const PAGINATION_COUNT = 6;

class AppView {
  productDetails: ProductDetails;
  catalog: Catalog;
  cart: Cart;

  cartItems: Types.TCart;

  constructor() {
    this.cart = new Cart();
    this.cartItems = this.cart.cartItems;
    this.productDetails = new ProductDetails(this.cart);
    this.catalog = new Catalog();
  }

  // Show product details
  showProductDetails(data: Types.Product) {
    this.productDetails.drawProduct(data);
  }

  // Create toggle
  createToggle() {
    const toggleQuery = new URLSearchParams(window.location.search);
    const toggleBtn = <HTMLDivElement>document.querySelector('.display-icon');
    const catalogContainer = <HTMLDivElement>document.querySelector('.cards-wrapper');
    this.getToggleView(toggleQuery, toggleBtn, catalogContainer);
    if (toggleBtn && catalogContainer) {
      toggleBtn.addEventListener('click', () => {
        if (toggleBtn.classList.contains('list')) {
          toggleBtn.classList.remove('list');
          catalogContainer.classList.remove('list');
          toggleQuery.set('view', 'card');
          const newPathQuery = window.location.pathname + '?' + toggleQuery.toString();
          history.pushState(null, '', newPathQuery);
        } else {
          toggleBtn.classList.add('list');
          catalogContainer.classList.add('list');
          toggleQuery.set('view', 'list');
          const newPathQuery = window.location.pathname + '?' + toggleQuery.toString();
          history.pushState(null, '', newPathQuery);
        }
      });
    }
  }

  getToggleView(toggleQuery: URLSearchParams, toggleBtn: HTMLDivElement, catalogContainer: HTMLDivElement) {
    const currView = toggleQuery.get('view');
    if (currView == 'list') {
      toggleBtn.classList.add('list');
      catalogContainer.classList.add('list');
    } else {
      toggleBtn.classList.remove('list');
      catalogContainer.classList.remove('list');
    }
  }

  // Sort dropdown
  createDropdown() {
    const dropdownSort = document.querySelector('.sort-dropdown');
    const dropdownMenu = document.querySelector('.sort-dropdown-items');
    dropdownSort?.addEventListener('click', () => {
      dropdownMenu?.classList.toggle('visible');
    });
  }

  // Retrieve categories from data --> draw
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

  // Pagination
  initPages(filteredArr: Types.Product[], pagesCount: number) {
    const catalogPages = <HTMLDivElement>document.querySelector('.catalog-pages');
    if (catalogPages) {
      if (pagesCount <= 0) {
        catalogPages.style.display = 'none';
      } else {
        catalogPages.style.display = 'flex';
        this.createPages(filteredArr, pagesCount);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initPagesandFilter(filteredArr: Types.Product[], filtersObj?: Types.IFilters) {
    const storagedItems = localStorage.getItem('onlineStoreCart112547');
    if (storagedItems) this.cart.cartItems = JSON.parse(storagedItems);
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    const pagesCount = Math.ceil(filteredArr.length / PAGINATION_COUNT);
    this.initPages(filteredArr, pagesCount);
    this.initSorting(filteredArr);
    if (catalogDiv) {
      catalogDiv.innerHTML = '';
      this.createCatalog(filteredArr, catalogDiv, 0);
      this.cart.updateHeader();
    }
  }

  createPages(filteredArr: Types.Product[], pagesCount: number) {
    const catalogPages = document.querySelector('.catalog-pages');
    // const pagesWrapper = document.querySelector('.pages-wrapper');
    const pagesWrapper = document.createElement('div');
    pagesWrapper?.classList.add('pages-wrapper');
    const pageNext = document.createElement('img');
    const pagePrev = document.createElement('img');
    pageNext.src = '../../assets/icons/btn-next.svg';
    pagePrev.src = '../../assets/icons/btn-prev.svg';
    // const pageNext = document.querySelector('.page-next');
    // const pagePrev = document.querySelector('.page-prev');
    pageNext.classList.add('btn-page');
    pagePrev.classList.add('btn-page');
    pageNext.classList.add('page-next');
    pagePrev.classList.add('page-prev');

    if (catalogPages) {
      catalogPages.innerHTML = '';
    }
    catalogPages?.append(pagePrev);
    const pagesArr: HTMLDivElement[] = [];
    // pagesArr.push(pageNext)
    for (let i = 0; i < pagesCount; i++) {
      pagesArr.push(document.createElement('p'));
      pagesArr[i].className = 'catalog__page';
      pagesArr[i].className = 'page-idx';
      pagesArr[i].textContent = String(i + 1);
      pagesWrapper?.append(pagesArr[i]);
      pagesArr[i].addEventListener('click', () => {
        this.goToPage(filteredArr, pagesArr, i);
      });
    }
    catalogPages?.append(pagesWrapper, pageNext);
    pagesArr[0].classList.add('page-idx--active');
    if (pageNext && pageNext.getAttribute('listener') !== 'true') {
      pageNext.addEventListener('click', () => {
        this.goToPage(filteredArr, pagesArr, this.findPageIdx(pagesArr) + 1);
      });
      pageNext.setAttribute('listener', 'true');
    }

    if (pagePrev && pagePrev.getAttribute('listener') !== 'true') {
      pagePrev.addEventListener('click', () => {
        if (this.findPageIdx(pagesArr) - 1 >= 0) {
          this.goToPage(filteredArr, pagesArr, this.findPageIdx(pagesArr) - 1);
        }
      });
      pagePrev.setAttribute('listener', 'true');
    }
  }

  goToPage(filteredArr: Types.Product[], pagesArr: HTMLDivElement[], idx: number) {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (idx >= 0 && idx < pagesArr.length) {
      for (let i = 0; i < pagesArr.length; i++) {
        pagesArr[i].classList.remove('page-idx--active');
      }
      pagesArr[idx].classList.add('page-idx--active');
      if (catalogDiv) {
        this.createCatalog(filteredArr, catalogDiv, idx);
      }
    }
  }

  findPageIdx(pagesArr: HTMLDivElement[]) {
    for (let i = 0; i < pagesArr.length; i++) {
      if (pagesArr[i].classList.contains('page-idx--active')) return i;
    }
    return 0;
  }

  // Catalog methods
  createCatalog(filteredArr: Types.Product[], catalogDiv: HTMLDivElement, page: number) {
    const startIdx = page * PAGINATION_COUNT;
    let endIdx = filteredArr.length >= PAGINATION_COUNT ? startIdx + PAGINATION_COUNT : filteredArr.length;
    if (endIdx > filteredArr.length) endIdx = filteredArr.length;
    catalogDiv.innerHTML = '';
    if (filteredArr.length == 0) {
      catalogDiv.innerHTML = `<div class='catalog-replacer'>No products found. Please try other filters.</div>`;
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        this.catalog.drawCard(filteredArr[i], catalogDiv);
      }
    }

    const productCards = document.querySelectorAll('.product-card');
    const productCardsDivsCart = document.querySelectorAll('.card-cart');
    if (productCardsDivsCart && productCards) {
      for (let i = 0, idx = startIdx; i < productCardsDivsCart.length; i++, idx++) {
        this.cart.initCartAdd(productCardsDivsCart[i], filteredArr[idx]);
      }
    }
  }

  createSortedCatalog(filteredArr: Types.Product[]) {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (catalogDiv) {
      const pagesCount = Math.ceil(filteredArr.length / PAGINATION_COUNT);
      this.initPages(filteredArr, pagesCount);
      this.createCatalog(filteredArr, catalogDiv, 0);
    }
  }

  initSorting(filteredArr: Types.Product[]) {
    const sortParams = new URLSearchParams(window.location.search);
    this.sortArrayInitial(filteredArr, sortParams);
    this.initSortingVisual(sortParams);
    const sortDropdown = document.querySelector('.sort-dropdown__label');
    const priceAsc = document.getElementById('price-asc');
    const priceDes = document.getElementById('price-des');
    const ratingAsc = document.getElementById('rating-asc');
    const ratingDes = document.getElementById('rating-des');
    priceAsc?.addEventListener('click', () => {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      });
      if (sortDropdown) sortDropdown.textContent = 'Price descending';
      this.addToQuery('priceDes', sortParams);
      this.createSortedCatalog(filteredArr);
    });
    priceDes?.addEventListener('click', () => {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      });
      if (sortDropdown) sortDropdown.textContent = 'Price ascending';
      this.addToQuery('priceAsc', sortParams);
      this.createSortedCatalog(filteredArr);
    });
    ratingAsc?.addEventListener('click', () => {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        return 0;
      });
      if (sortDropdown) sortDropdown.textContent = 'Rating descending';
      this.addToQuery('ratingDes', sortParams);
      this.createSortedCatalog(filteredArr);
    });
    ratingDes?.addEventListener('click', () => {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.rating < b.rating) return -1;
        if (a.rating > b.rating) return 1;
        return 0;
      });
      if (sortDropdown) sortDropdown.textContent = 'Rating ascending';
      this.addToQuery('ratingAsc', sortParams);
      this.createSortedCatalog(filteredArr);
    });
  }

  initSortingVisual(sortParams: URLSearchParams) {
    const sortDropdown = document.querySelector('.sort-dropdown__label');
    const sortParamsNew = sortParams.get('sort');
    if (sortDropdown) {
      if (sortParamsNew == 'priceAsc') sortDropdown.textContent = 'Price ascending';
      else if (sortParamsNew == 'priceDes') sortDropdown.textContent = 'Price descending';
      else if (sortParamsNew == 'ratingAsc') sortDropdown.textContent = 'Rating ascending';
      else if (sortParamsNew == 'ratingDes') sortDropdown.textContent = 'Rating descending';
    }
  }

  // Query methods

  addToQuery(type: string, sortParams: URLSearchParams) {
    sortParams.set('sort', type);
    const newPathQuery = window.location.pathname + '?' + sortParams.toString();
    history.pushState(null, '', newPathQuery);
  }

  sortArrayInitial(filteredArr: Types.Product[], sortParams: URLSearchParams) {
    const sortKey = sortParams.get('sort');
    if (sortKey == 'priceAsc') {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      });
    } else if (sortKey == 'priceDes') {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      });
    } else if (sortKey == 'ratingAsc') {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        return 0;
      });
    } else if (sortKey == 'ratingDes') {
      filteredArr = filteredArr.sort((a, b) => {
        if (a.rating < b.rating) return -1;
        if (a.rating > b.rating) return 1;
        return 0;
      });
    }
  }

  createCart() {
    this.cart.initCartPage();
  }
}

export default AppView;
