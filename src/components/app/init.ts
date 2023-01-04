import AppController from '../controller/controller';
import AppView from '../appView/appView';
import Router from '../route/router';
import Route from '../route/route';
import { Types } from '../types/Types';

export default class Init {
  controller: AppController;
  view: AppView;
  router: Router;
  filtersObj: Types.IFilters;
  cache: Types.Product[] = [];
  cartItems: Types.TCart = [];

  constructor() {
    this.router = new Router([
      new Route('catalog', 'catalog.html', true),
      new Route('cart', 'cart.html'),
      new Route('404', '404.html'),
    ]);
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
      }
    };
  }

  getData() {
    this.controller.getProducts((data?) => {
      if (data !== undefined) {
        this.cache = [...data.products];
        this.loadCardRoutes(data.products);
        this.initApp();
      }
    });
  }

  loadCardRoutes(data: Types.Product[]) {
    for (let i = 0; i < data.length; i++) {
      this.router.routes.push(new Route(`product-details/${data[i].id}`, 'product-details.html'));
    }
  }

  initApp() {
    if (window.location.hash == '' || window.location.hash == '#catalog') {
      this.router.init(() => {
        this.initFilters(this.cache);
        this.initCatalog(this.cache);
      });
    } else if (window.location.hash == '#cart') {
      this.router.init(() => {
        this.initCart();
      });
    } else if (window.location.hash.match(/^(\#product-details\/(100|[1-9][0-9]?))$/g)) {
      this.router.init(() => {
        console.log(this.router.routes);
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
      });
    }
  }

  initCatalog(data: Types.Product[]) {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (data !== undefined && catalogDiv) {
      catalogDiv.innerHTML = '';
      this.view.createCatalog(data, catalogDiv, this.filtersObj);
      this.view.createToggle();
    }
  }

  initCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.view.createCart();
    }
  }

  initFilters(data: Types.Product[]) {
    const filtersDiv: HTMLDivElement | null = document.querySelector('.filters-wrapper');
    if (data !== undefined && filtersDiv) {
      this.view.createCheckFilters(data, 'brand');
      this.view.createCheckFilters(data, 'category');
      this.view.createPriceFilters(data, this.filtersObj);
      this.view.createStockFilters(data, this.filtersObj);
      this.view.createDiscountFilters(data, this.filtersObj);
      this.filtersCheckListener(data);
      this.filtersRangeListener(data);
      // this.view.createFilterCaregories(data, filtersDiv);
      // this.view.createFilterBrands(data, filtersDiv);
      // this.view.createFilterPrice(data, filtersDiv, this.filtersObj);7
      // * TODO: WRITE FILTERS FOR PRICE & QTY + SLIDER
      // * CHECK: IF FILTERS DUPLICATE
      // * TODO: SEARCH & FILTER THROUGH QUERY
      // * TODO: COMBINE SEARCHING AND FILTERING
      // * CHRCK: FOR DUPLICATION
      // * TODO: SORTING + ADD QUERY
      // * TODO: ADD VIEWSTYLE TO QUERY
      // * GET QUERY = WINDOW.LOCATION.SEARCH

    }
  }

  changeCheckboxes(input: NodeListOf<HTMLElement>, index: number, arr: string[]) {
    const checkbox = input[index] as HTMLInputElement;
    const checkboxArr = arr;

    if (checkbox.checked) {
      checkboxArr.push(checkbox.value);
    } else {
      const idx = checkboxArr.indexOf(checkbox.value);
      checkboxArr.splice(idx, 1);
    }
  }


  filtersCheckListener(data: Types.Product[]) {
    const categoriesInput = document.getElementsByName('category');
    const categoriesLabels = document.querySelectorAll('.category__item');

    const brandInputs = document.getElementsByName('brand');
    const brandLabels = document.querySelectorAll('.brand__item');

    categoriesLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(categoriesInput, indx, this.filtersObj.categories);
        this.initCatalog(data);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });

    brandLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(brandInputs, indx, this.filtersObj.brands);
        this.initCatalog(data);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });
  }

  filtersRangeListener(data: Types.Product[]) {
    this.addFilterRangeListener('price', data, this.filtersObj.price);
    this.addFilterRangeListener('stock', data, this.filtersObj.stock);
    this.addFilterRangeListener('discount', data, this.filtersObj.discount);
  }

  addFilterRangeListener(filterType: string, data: Types.Product[], inputVals: { min: number; max: number }) {
    const sliderWrapper = document.querySelector(`.${filterType}-range-wrapper`);
    const sliderInputMin = <HTMLInputElement>sliderWrapper?.querySelector('.range-min');
    const sliderInputMax = <HTMLInputElement>sliderWrapper?.querySelector('.range-max');
    const inputBoxMin = <HTMLInputElement>document.querySelector(`.${filterType}-min`);
    const inputBoxMax = <HTMLInputElement>document.querySelector(`.${filterType}-max`);
    const sliderTrack = <HTMLDivElement>sliderWrapper?.querySelector('.slider-track');
    sliderInputMin.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      setTimeout(() => {
        this.initCatalog(data);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
    });
    sliderInputMax.addEventListener('input', () => {
      inputVals.min = +sliderInputMin.value;
      inputVals.max = +sliderInputMax.value;
      setTimeout(() => {
        this.initCatalog(data);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
    });
    inputBoxMin.addEventListener('input', () => {
      sliderInputMin.value = inputBoxMin.value;
      if (inputBoxMin.value == '') sliderInputMin.value = sliderInputMin.min;
      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMin.value;
      setTimeout(() => {
        this.initCatalog(data);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
    });
    inputBoxMin.addEventListener('input', () => {
      sliderInputMax.value = inputBoxMin.value;
      if (inputBoxMax.value == '') sliderInputMax.value = sliderInputMax.max;
      inputVals.min = +inputBoxMin.value;
      inputVals.max = +inputBoxMin.value;
      setTimeout(() => {
        this.initCatalog(data);
      }, 300);
      this.view.catalog.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, false);
    });
  }
}
