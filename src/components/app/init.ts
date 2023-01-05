import AppController from '../controller/controller';
import AppView from '../appView/appView';
import Router from '../route/router';
import Route from '../route/route';
import { Types } from '../types/Types';

export default class Init {
  controller: AppController;
  view: AppView;
  filtersObj: Types.IFilters;
  cache: Types.Product[] = [];
  filteredArr: Types.Product[] = [];
  searchArr: Types.Product[] = [];

  constructor() {
    // this.router = new Router([
    //   new Route('catalog', 'catalog.html', true),
    //   new Route('cart', 'cart.html'),
    //   new Route('404', '404.html'),
    // ]);
    this.controller = new AppController();
    this.view = new AppView();
    this.filtersObj = {
      categories: [],
      brands: [],
      price: {
        min: 0,
        max: 0,
      },
      stock: {
        min: 0,
        max: 0,
      },
      discount: {
        min: 0,
        max: 0,
      },
    };
  }

  getData(routeArr: Route[], callback: () => void) {
    this.controller.getProducts((data?) => {
      if (data !== undefined) {
        this.cache = [...data.products];
        this.loadCardRoutes(routeArr, data.products);
        callback();
      }
    });
  }

  loadCardRoutes(routeArr: Route[], data: Types.Product[]) {
    for (let i = 0; i < data.length; i++) {
      routeArr.push(new Route(`product-details/${data[i].id}`, 'product-details.html'));
    }
  }

  initMainPage() {
    this.initSearch();
    const searchQuery = new URLSearchParams(window.location.search);
    if (searchQuery.has('search')) {
      const searchString = searchQuery.get('search');
      console.log(searchString);
      if (searchString) this.makeSearch(searchString);
    } else {
      this.initFilters();
      this.initCatalog();
    }
  }

  initCatalog() {
    const data = this.cache;
    if (data !== undefined) {
      this.view.createToggle();
      this.filterProducts(this.cache, this.filtersObj);
      this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      this.view.createDropdown();
    }
  }
  searchAndInit(value: string) {
    const searchResults = <HTMLSpanElement>document.querySelector('.search-results');
    this.controller.getSearchResults(value, (data?) => {
      if (data !== undefined) {
        this.searchArr = [...data.products];
        this.filterProducts(this.cache, this.filtersObj);
        this.initFilters();
        this.initCatalog();
        searchResults.textContent = `${this.searchArr.length} results for `;
      }
    });
  }

  search(value: string) {
    const searchResults = <HTMLSpanElement>document.querySelector('.search-results');
    this.controller.getSearchResults(value, (data?) => {
      if (data !== undefined) {
        this.searchArr = [...data.products];
        this.filterProducts(this.cache, this.filtersObj);
        this.view.initPagesandFilter(this.searchArr, this.filtersObj);
        searchResults.textContent = `${this.searchArr.length} results for `;
      }
    });
  }

  makeSearch(searchString: string) {
    const searchParam = <HTMLSpanElement>document.querySelector('.search-param');
    const searchBar = <HTMLInputElement>document.querySelector('.search-bar-input');
    const resultsWrapper = <HTMLDivElement>document.querySelector('.results-wrapper');
    const searchCount = <HTMLDivElement>document.querySelector('.search-count-wrapper');
    searchBar.value = searchString;
    if (searchParam) searchParam.textContent = `"${searchString}"`;
    resultsWrapper.style.justifyContent = 'space-between';
    searchCount.style.display = 'inline';
    this.searchAndInit(searchString);
  }

  initSearch() {
    const searchQuery = new URLSearchParams(window.location.search);
    const resultsWrapper = <HTMLDivElement>document.querySelector('.results-wrapper');
    const searchBar = <HTMLInputElement>document.querySelector('.search-bar-input');
    const searchCount = <HTMLDivElement>document.querySelector('.search-count-wrapper');
    const searchParam = <HTMLSpanElement>document.querySelector('.search-param');
    const searchResults = <HTMLSpanElement>document.querySelector('.search-results');
    searchBar?.addEventListener('change', () => {
      if (searchBar.value == '') {
        searchQuery.delete('search');
        this.setQuery(searchQuery);
        this.searchArr = [];
        resultsWrapper.style.justifyContent = 'flex-end';
        searchCount.style.display = 'none';
        this.controller.getProducts((data?) => {
          if (data !== undefined) {
            this.cache = [...data.products];
            this.view.initPagesandFilter(this.cache, this.filtersObj);
          }
        });
      } else {
        searchQuery.set('search', searchBar.value);
        this.setQuery(searchQuery);
        if (searchParam) searchParam.textContent = `"${searchBar.value}"`;
        resultsWrapper.style.justifyContent = 'space-between';
        searchCount.style.display = 'inline';
        this.search(searchBar.value);
        searchResults.textContent = `${this.searchArr.length} results for `;
      }
    });
  }

  initCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.view.createCart();
    }
  }

  initProductDetails() {
    const windowHash = window.location.hash.split('/');
    const productWrapperDiv: HTMLDivElement | null = document.querySelector('.product-wrapper');
    this.controller.getProductDetails(
      (data?) => {
        if (data !== undefined && productWrapperDiv) {
          this.view.showProductDetails(data);
        }
      },
      {
        id: Number(windowHash[windowHash.length - 1]),
      }
    );
  }

  initFilters(/* data: Types.Product[] */) {
    const filterParams = new URLSearchParams(window.location.search);
    const data = this.cache;
    const filtersDiv: HTMLDivElement | null = document.querySelector('.filters-wrapper');
    if (data !== undefined && filtersDiv) {
      this.view.createCheckFilters(data, 'brand');
      this.view.createCheckFilters(data, 'category');
      this.view.createPriceFilters(data, this.filtersObj);
      this.view.createStockFilters(data, this.filtersObj);
      this.view.createDiscountFilters(data, this.filtersObj);
      this.filtersCheckListener(data, filterParams);
      this.filtersRangeListener(data, filterParams);
    }
  }

  changeCheckboxes(
    input: NodeListOf<HTMLElement>,
    index: number,
    arr: string[],
    filterParams: URLSearchParams,
    type: string
  ) {
    const checkbox = <HTMLInputElement>input[index];
    const checkboxArr = arr;
    if (checkbox.checked) {
      console.log('checkbox arr before add', checkboxArr);
      this.addToQuery(checkbox, filterParams, type);
      checkboxArr.push(checkbox.value);
    } else {
      this.deleteFromQuery(checkbox, filterParams, type);
      console.log('checkBoxArr ebfore splice', checkboxArr);
      const idx = checkboxArr.indexOf(checkbox.value);
      console.log('idx', idx);
      checkboxArr.splice(idx, 1);
      console.log('checkBoxArr after splice', checkboxArr);
    }
  }

  setQuery(filterParams: URLSearchParams) {
    const newPathQuery = window.location.pathname + '?' + filterParams.toString();
    history.pushState(null, '', newPathQuery);
  }

  addToQuery(input: HTMLInputElement, filterParams: URLSearchParams, type: string) {
    if (filterParams.has(type)) {
      const oldParams = filterParams.get(type);
      if (oldParams) filterParams.set(type, oldParams.concat(',', input.value));
    } else {
      filterParams.set(type, input.value);
    }
    this.setQuery(filterParams);
  }

  deleteFromQuery(input: HTMLInputElement, filterParams: URLSearchParams, type: string) {
    const filterQuery = filterParams.get(type)?.split(',');
    const idxOfToDel = filterQuery?.indexOf(input.value);
    // console.log(filterQuery);
    // console.log(idxOfToDel);
    if (idxOfToDel !== undefined && filterQuery !== undefined) {
      filterQuery?.splice(idxOfToDel, 1);
      filterParams.set(type, filterQuery.join(','));
    } else filterParams.delete(type);
    if (filterParams.get(type) == '') filterParams.delete(type);
    this.setQuery(filterParams);
  }

  initCategoryFiltersFromQuery(inputList: NodeListOf<HTMLInputElement>, filterParams: URLSearchParams) {
    if (filterParams.has('category')) {
      const filterArr = filterParams.get('category')?.split(',');
      const inputArr = Array.from(inputList);
      if (filterArr) {
        for (let i = 0; i < filterArr.length; i++) {
          const checkedEl = inputArr.find((el) => el.value == filterArr[i]);
          if (checkedEl) checkedEl.checked = true;
        }
      }
      this.changeCategoryCheckboxQuery(inputList);
    }
  }

  initRangeFiltersFromQuery(
    filterParams: URLSearchParams,
    type: string,
    sliderInputMin: HTMLInputElement,
    sliderInputMax: HTMLInputElement,
    inputBoxMin: HTMLInputElement,
    inputBoxMax: HTMLInputElement
  ) {
    if (filterParams.has(type)) {
      const minMax = filterParams.get(type)?.split(',');
      if (minMax) {
        const sliderTrack = <HTMLDivElement>(
          document.querySelector(`.${type}-range-wrapper`)?.querySelector('.slider-track')
        );
        sliderInputMin.value = inputBoxMin.value = String(minMax[0]);
        sliderInputMax.value = inputBoxMax.value = String(minMax[1]);
        this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
        if (type == 'price') {
          this.filtersObj.price.min = +minMax[0];
          this.filtersObj.price.max = +minMax[1];
        } else if (type == 'discount') {
          this.filtersObj.discount.min = +minMax[0];
          this.filtersObj.discount.max = +minMax[1];
        } else if (type == 'stock') {
          this.filtersObj.stock.min = +minMax[0];
          this.filtersObj.stock.max = +minMax[1];
        }
      }
    }
  }

  addToRangeQuery(inputMin: HTMLInputElement, inputMax: HTMLInputElement, filterParams: URLSearchParams, type: string) {
    filterParams.set(type, `${inputMin.value},${inputMax.value}`);
    this.setQuery(filterParams);
  }

  initBrandFiltersFromQuery(inputList: NodeListOf<HTMLInputElement>, filterParams: URLSearchParams) {
    if (filterParams.has('brand')) {
      const filterArr = filterParams.get('brand')?.split(',');
      const inputArr = Array.from(inputList);
      if (filterArr) {
        for (let i = 0; i < filterArr.length; i++) {
          const checkedEl = inputArr.find((el) => el.value == filterArr[i]);
          if (checkedEl) checkedEl.checked = true;
        }
      }
      this.changeBrandCheckboxQuery(inputList);
    }
  }

  changeCategoryCheckboxQuery(inputList: NodeListOf<HTMLInputElement>) {
    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i].checked) {
        if (!this.filtersObj.categories.includes(inputList[i].value)) {
          this.filtersObj.categories.push(inputList[i].value);
        }
      }
    }
  }

  changeBrandCheckboxQuery(inputList: NodeListOf<HTMLInputElement>) {
    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i].checked) {
        if (!this.filtersObj.brands.includes(inputList[i].value)) {
          this.filtersObj.brands.push(inputList[i].value);
        }
      }
    }
  }

  filtersCheckListener(data: Types.Product[], filterParams: URLSearchParams) {
    const categoriesInput = <NodeListOf<HTMLInputElement>>document.getElementsByName('category');
    const categoriesLabels = document.querySelectorAll('.category__item');

    const brandInputs = <NodeListOf<HTMLInputElement>>document.getElementsByName('brand');
    const brandLabels = document.querySelectorAll('.brand__item');

    this.initCategoryFiltersFromQuery(categoriesInput, filterParams);
    categoriesLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(categoriesInput, indx, this.filtersObj.categories, filterParams, 'category');
        this.filterProducts(this.cache, this.filtersObj);
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });

    this.initBrandFiltersFromQuery(brandInputs, filterParams);
    brandLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(brandInputs, indx, this.filtersObj.brands, filterParams, 'brand');
        this.filterProducts(this.cache, this.filtersObj);
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });
  }

  filtersRangeListener(data: Types.Product[], filterParams: URLSearchParams) {
    this.addFilterRangeListener('price', this.filtersObj.price, filterParams);
    this.addFilterRangeListener('stock', this.filtersObj.stock, filterParams);
    this.addFilterRangeListener('discount', this.filtersObj.discount, filterParams);
  }

  addFilterRangeListener(filterType: string, inputVals: { min: number; max: number }, filterParams: URLSearchParams) {
    const sliderWrapper = document.querySelector(`.${filterType}-range-wrapper`);
    const sliderInputMin = <HTMLInputElement>sliderWrapper?.querySelector('.range-min');
    const sliderInputMax = <HTMLInputElement>sliderWrapper?.querySelector('.range-max');
    const inputBoxMin = <HTMLInputElement>document.querySelector(`.${filterType}-min`);
    const inputBoxMax = <HTMLInputElement>document.querySelector(`.${filterType}-max`);
    const sliderTrack = <HTMLDivElement>sliderWrapper?.querySelector('.slider-track');
    this.initRangeFiltersFromQuery(filterParams, filterType, sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax);
    sliderInputMin.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
      this.addToRangeQuery(sliderInputMin, sliderInputMax, filterParams, filterType);
    });
    sliderInputMax.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
      this.addToRangeQuery(sliderInputMin, sliderInputMax, filterParams, filterType);
    });
    inputBoxMin.addEventListener('input', () => {
      sliderInputMin.value = inputBoxMin.value;
      if (inputBoxMin.value == '') sliderInputMin.value = sliderInputMin.min;
      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
      this.addToRangeQuery(inputBoxMin, inputBoxMax, filterParams, filterType);
    });
    inputBoxMin.addEventListener('input', () => {
      sliderInputMax.value = inputBoxMin.value;
      if (inputBoxMax.value == '') sliderInputMax.value = sliderInputMax.max;
      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
      this.addToRangeQuery(inputBoxMin, inputBoxMax, filterParams, filterType);
    });
  }

  filterProducts(data: Types.Product[], filtersObj: Types.IFilters) {
    this.filteredArr = [];
    const searchParams = new URLSearchParams(window.location.search);
    if (this.searchArr.length !== 0 || searchParams.has('search')) {
      console.log('filter with search');
      console.log(this.searchArr);
      data = this.searchArr;
    }
    console.log('filter with cache');
    
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
}
