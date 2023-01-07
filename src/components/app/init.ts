import AppController from '../controller/controller';
import AppView from '../appView/appView';
import Route from '../route/route';
import { Types } from '../types/Types';

export default class Init {
  controller: AppController;

  view: AppView;

  filtersObj: Types.IFilters;

  cache: Types.Product[] = [];

  filteredArr: Types.Product[] = [];

  searchArr: Types.Product[] = [];

  filterQuery = new URLSearchParams(window.location.search);

  constructor() {
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

  // Get all product data and load routes
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

  // Init main catalog page
  initMainPage() {
    this.initSearchInput();
    this.initFilterButtons();
    // init catalog from search query and if it's empty get all products
    const searchQuery = this.getQuery('search');
    if (searchQuery) {
      this.makeInitialSearch(searchQuery);
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

  // Search related methods
  // * Search Input Listener
  initSearchInput() {
    const resultsWrapper = <HTMLDivElement>document.querySelector('.results-wrapper');
    const searchBar = <HTMLInputElement>document.querySelector('.search-bar-input');
    const searchCount = <HTMLDivElement>document.querySelector('.search-count-wrapper');
    const searchParam = <HTMLSpanElement>document.querySelector('.search-param');
    searchBar?.addEventListener('change', () => {
      if (searchBar.value == '') {
        // empty search query & search array
        this.searchArr = [];
        this.removeFromQuery('search');
        // change display
        resultsWrapper.style.justifyContent = 'flex-end';
        searchCount.style.display = 'none';
        // write to cache data
        this.controller.getProducts((data?) => {
          if (data !== undefined) {
            this.cache = [...data.products];
            this.view.initPagesandFilter(this.cache, this.filtersObj);
          }
        });
      } else {
        this.writeToQuery('search', searchBar.value);
        // display search input and qty
        if (searchParam) searchParam.textContent = `"${searchBar.value}"`;
        resultsWrapper.style.justifyContent = 'space-between';
        searchCount.style.display = 'inline';
        // perform search
        this.search(searchBar.value);
      }
    });
  }

  makeInitialSearch(searchString: string) {
    const searchParam = <HTMLSpanElement>document.querySelector('.search-param');
    const searchBar = <HTMLInputElement>document.querySelector('.search-bar-input');
    const resultsWrapper = <HTMLDivElement>document.querySelector('.results-wrapper');
    const searchCount = <HTMLDivElement>document.querySelector('.search-count-wrapper');
    searchBar.value = searchString;
    if (searchParam) searchParam.textContent = `"${searchString}"`;
    resultsWrapper.style.justifyContent = 'space-between';
    searchCount.style.display = 'inline';
    this.initialSearch(searchString);
  }

  initialSearch(value: string) {
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

  // * simple search
  search(value: string) {
    const searchResults = <HTMLSpanElement>document.querySelector('.search-results');
    this.controller.getSearchResults(value, (data?) => {
      if (data !== undefined) {
        this.searchArr = [...data.products];
        this.filterProducts(this.searchArr, this.filtersObj);
        this.view.initPagesandFilter(this.searchArr, this.filtersObj);
        searchResults.textContent = `${this.searchArr.length} results for `;
      }
    });
  }

  // Cart methods
  initCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.view.createCart();
    }
  }

  // Product details methods
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

  // Filter related methods
  // * Init general filters
  initFilters() {
    const data = this.cache;
    const filtersDiv: HTMLDivElement | null = document.querySelector('.filters-wrapper');
    if (data !== undefined && filtersDiv) {
      this.view.createCheckFilters(data, 'brand');
      this.view.createCheckFilters(data, 'category');
      this.view.createPriceFilters(data, this.filtersObj);
      this.view.createStockFilters(data, this.filtersObj);
      this.view.createDiscountFilters(data, this.filtersObj);
      this.filtersCheckListener();
      this.filtersRangeListener();
      this.initFiltersFromQuery();
    }
  }

  initFilterButtons() {
    const btnRemoveFilters = document.querySelector('.btn-remove-filters');
    const btnCopyFilters = document.querySelector('.btn-copy-filters');
    btnRemoveFilters?.addEventListener('click', () => {
      // window.location.search = '';
      this.removeFromQuery('search');
      this.removeFromQuery('price');
      this.removeFromQuery('stock');
      this.removeFromQuery('category');
      this.removeFromQuery('brand');
      this.removeFromQuery('discount');
      this.initFilters();
      this.initCatalog();
    });
    btnCopyFilters?.addEventListener('click', () => {
      const copyText = window.location.href;
      navigator.clipboard.writeText(copyText).then(
        () => {
          btnCopyFilters.textContent = 'Copied';
          btnCopyFilters.classList.add('copied');
        },
        () => {
          btnCopyFilters.textContent = 'Copy error';
          btnCopyFilters.classList.add('copied');
        }
      );
    });
  }

  // * Init filters from query
  initFiltersFromQuery() {
    const categoriesInput = <NodeListOf<HTMLInputElement>>document.getElementsByName('category');
    const brandInputs = <NodeListOf<HTMLInputElement>>document.getElementsByName('brand');
    this.getCheckboxFiltersFromQuery('category', categoriesInput);
    this.getCheckboxFiltersFromQuery('brand', brandInputs);
    this.initRangeFiltersFromQuery('price');
    this.initRangeFiltersFromQuery('stock');
    this.initRangeFiltersFromQuery('discount');
  }

  initRangeFiltersFromQuery(type: string) {
    const sliderWrapper = document.querySelector(`.${type}-range-wrapper`);
    const sliderInputMin = <HTMLInputElement>sliderWrapper?.querySelector('.range-min');
    const sliderInputMax = <HTMLInputElement>sliderWrapper?.querySelector('.range-max');
    const inputBoxMin = <HTMLInputElement>document.querySelector(`.${type}-min`);
    const inputBoxMax = <HTMLInputElement>document.querySelector(`.${type}-max`);
    this.getRangeFiltersFromQuery(type, sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax);
  }

  getRangeFiltersFromQuery(
    type: string,
    sliderInputMin: HTMLInputElement,
    sliderInputMax: HTMLInputElement,
    inputBoxMin: HTMLInputElement,
    inputBoxMax: HTMLInputElement
  ) {
    const rangeFilterParams = this.getQuery(type);
    if (rangeFilterParams) {
      const minMax = rangeFilterParams.split(',');
      if (minMax) {
        const sliderTrack = <HTMLDivElement>(
          document.querySelector(`.${type}-range-wrapper`)?.querySelector('.slider-track')
        );
        sliderInputMin.value = inputBoxMin.value = String(minMax[0]);
        sliderInputMax.value = inputBoxMax.value = String(minMax[1]);
        this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
        this.getRangeFiltersByType(type, minMax);
      }
    } else {
      sliderInputMin.value = inputBoxMin.value = sliderInputMin.min;
      sliderInputMax.value = inputBoxMax.value = sliderInputMin.max;
      if (type == 'price') {
        this.filtersObj.price.min = +sliderInputMin.value;
        this.filtersObj.price.max = +sliderInputMax.value;
      } else if (type == 'discount') {
        this.filtersObj.discount.min = +sliderInputMin.value;
        this.filtersObj.discount.max = +sliderInputMax.value;
      } else if (type == 'stock') {
        this.filtersObj.stock.min = +sliderInputMin.value;
        this.filtersObj.stock.max = +sliderInputMax.value;
      }
    }
  }

  getRangeFiltersByType(type: string, minMax: string[]) {
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

  getCheckboxFiltersFromQuery(type: string, inputList: NodeListOf<HTMLInputElement>) {
    const checkboxParams = this.getQuery(type);
    console.log(checkboxParams);
    if (checkboxParams) {
      const filterArr = checkboxParams.split(',');
      const inputArr = Array.from(inputList);
      if (filterArr) {
        for (let i = 0; i < filterArr.length; i++) {
          const checkedEl = inputArr.find((el) => el.value == filterArr[i]);
          if (checkedEl) checkedEl.checked = true;
        }
      }
      this.changeCheckboxFromQuery(type, inputList);
    } else {
      for (let i = 0; i < inputList.length; i++) {
        inputList[i].checked = false;
      }
      this.filtersObj.brands = [];
      this.filtersObj.categories = [];
    }
  }

  changeCheckboxFromQuery(type: string, inputList: NodeListOf<HTMLInputElement>) {
    if (type == 'category') {
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].checked) {
          if (!this.filtersObj.categories.includes(inputList[i].value)) {
            this.filtersObj.categories.push(inputList[i].value);
          }
        }
      }
    } else if (type == 'brand') {
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].checked) {
          if (!this.filtersObj.brands.includes(inputList[i].value)) {
            this.filtersObj.brands.push(inputList[i].value);
          }
        }
      }
    }
  }

  // FilterListeners
  addFilterRangeListener(filterType: string, inputVals: { min: number; max: number }) {
    const sliderWrapper = document.querySelector(`.${filterType}-range-wrapper`);
    const sliderInputMin = <HTMLInputElement>sliderWrapper?.querySelector('.range-min');
    const sliderInputMax = <HTMLInputElement>sliderWrapper?.querySelector('.range-max');
    const inputBoxMin = <HTMLInputElement>document.querySelector(`.${filterType}-min`);
    const inputBoxMax = <HTMLInputElement>document.querySelector(`.${filterType}-max`);
    const sliderTrack = <HTMLDivElement>sliderWrapper?.querySelector('.slider-track');
    sliderInputMin.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);

      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
      this.writeToQuery(filterType, `${sliderInputMin.value},${sliderInputMax.value}`);
    });

    sliderInputMax.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);

      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
      this.writeToQuery(filterType, `${sliderInputMin.value},${sliderInputMax.value}`);
    });

    inputBoxMin.addEventListener('input', () => {
      sliderInputMin.value = inputBoxMin.value;
      sliderInputMax.value = inputBoxMax.value;
      if (inputBoxMin.value == '') sliderInputMin.value = sliderInputMin.min;

      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);

      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
      this.writeToQuery(filterType, `${inputBoxMin.value},${inputBoxMax.value}`);
    });
    inputBoxMax.addEventListener('input', () => {
      sliderInputMin.value = inputBoxMin.value;
      sliderInputMax.value = inputBoxMax.value;
      if (inputBoxMax.value == '') sliderInputMax.value = sliderInputMax.max;

      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMax.value;
      this.filterProducts(this.cache, this.filtersObj);
      setTimeout(() => {
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      }, 300);

      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
      this.writeToQuery(filterType, `${inputBoxMin.value},${inputBoxMax.value}`);
    });
  }

  filtersCheckListener() {
    const categoriesInput = <NodeListOf<HTMLInputElement>>document.getElementsByName('category');
    const categoriesLabels = document.querySelectorAll('.category__item');

    const brandInputs = <NodeListOf<HTMLInputElement>>document.getElementsByName('brand');
    const brandLabels = document.querySelectorAll('.brand__item');

    categoriesLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(categoriesInput, indx, this.filtersObj.categories, 'category');
        this.filterProducts(this.cache, this.filtersObj);
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      });
    });

    brandLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(brandInputs, indx, this.filtersObj.brands, 'brand');
        this.filterProducts(this.cache, this.filtersObj);
        this.view.initPagesandFilter(this.filteredArr, this.filtersObj);
      });
    });
  }

  filtersRangeListener() {
    this.addFilterRangeListener('price', this.filtersObj.price);
    this.addFilterRangeListener('stock', this.filtersObj.stock);
    this.addFilterRangeListener('discount', this.filtersObj.discount);
  }

  changeCheckboxes(input: NodeListOf<HTMLElement>, index: number, arr: string[], type: string) {
    const checkbox = <HTMLInputElement>input[index];
    const checkboxArr = arr;
    if (checkbox.checked) {
      this.addToQuery(checkbox, type);
      checkboxArr.push(checkbox.value);
    } else {
      this.deleteFromQuery(checkbox, type);
      const idx = checkboxArr.indexOf(checkbox.value);
      checkboxArr.splice(idx, 1);
    }
  }

  // * Perform Filtering
  filterProducts(data: Types.Product[], filtersObj: Types.IFilters) {
    this.filteredArr = [];
    const searchParams = new URLSearchParams(window.location.search);
    if (this.searchArr.length !== 0 || searchParams.has('search')) {
      data = this.searchArr;
    }

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
        Math.round(product.discountPercentage) >= filtersObj.discount.min &&
        Math.round(product.discountPercentage) <= filtersObj.discount.max
    );
  }

  // Query related methods
  getQuery(key: string) {
    if (this.filterQuery.has(key)) {
      return this.filterQuery.get(key);
    }
    return false;
  }

  removeFromQuery(key: string) {
    this.filterQuery.delete(key);
    const newPathQuery = window.location.pathname + '?' + this.filterQuery.toString() + window.location.hash;
    history.pushState(null, '', newPathQuery);
  }

  writeToQuery(key: string, value: string) {
    this.filterQuery.set(key, value);
    const newPathQuery = window.location.pathname + '?' + this.filterQuery.toString() + window.location.hash;
    history.pushState(null, '', newPathQuery);
  }

  addToQuery(input: HTMLInputElement, type: string) {
    if (this.filterQuery.has(type)) {
      const oldParams = this.filterQuery.get(type);
      if (!oldParams?.includes(input.value) && oldParams) {
        this.writeToQuery(type, oldParams.concat(',', input.value));
      }
    } else {
      this.writeToQuery(type, input.value);
    }
  }

  deleteFromQuery(input: HTMLInputElement, type: string) {
    const filterQuery = this.filterQuery.get(type)?.split(',');
    const idxOfToDel = filterQuery?.indexOf(input.value);
    if (idxOfToDel !== undefined && filterQuery !== undefined) {
      filterQuery?.splice(idxOfToDel, 1);
      this.filterQuery.set(type, filterQuery.join(','));
    } else this.filterQuery.delete(type);
    if (this.filterQuery.get(type) == '') this.filterQuery.delete(type);
    const newPathQuery = window.location.pathname + '?' + this.filterQuery.toString() + window.location.hash;
    history.pushState(null, '', newPathQuery);
  }
}
