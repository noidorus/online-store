import AppController from '../controller/controller';
import AppView from '../appView/appView';
import Router from '../route/router';
import Route from '../route/route';
import { Types } from '../types/Types';

export default class Init {
  controller: AppController;
  view: AppView;
  cardRouter: Router = new Router([]);
  filtersObj: Types.IFilters;
  page: number;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
    this.filtersObj = {
      categories: [],
      brands: [],
    };
    this.page = 0;
  }

  initHeaderLinks() {
    const catalogLink = document.querySelector('.nav-list__item');

    catalogLink?.addEventListener('click', () => {
      window.onhashchange = () => {
        this.initCatalog();
        this.initFilters();
      };
    });
  }

  initCatalog() {
    setTimeout(() => {
      const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
      this.controller.getProducts((data?) => {
        if (data !== undefined && catalogDiv) {
          catalogDiv.innerHTML = '';
          this.view.createCatalog(data, catalogDiv, this.filtersObj, this.page);
          this.view.createToggle();
          this.selectCards();
        } else if (data !== undefined) {
          for (let i = 0; i < data.products.length; i++) {
            this.makeRoute(data.products[i].id);
          }
        }
      });
    }, 50);
  }

  selectCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((el) => {
      this.makeRoute(Number(el.id.split('-')[1]));
      this.initCardLinks(el);
    });
  }

  initCardLinks(el: Element) {
    el.addEventListener('click', (e) => {
      if (e.target) {
        const eventTarget = <HTMLDivElement>e.target;
        if (
          !eventTarget.classList.contains('card-cart-img') &&
          !eventTarget.classList.contains('card-cart') &&
          !eventTarget.classList.contains('card-bottom-wrapper')
        ) {
          window.location.hash = `#product-details/${el.id.split('-')[1]}`;
          this.initProductDetails();
        }
      }
    });
  }

  initProductDetails() {
    setTimeout(() => {
      const windowHash = window.location.hash.split('/');
      if (windowHash[0] === '#product-details') {
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
    }, 500);
  }

  makeRoute(elId: number) {
    this.cardRouter.routes.push(new Route(`product-details/${elId}`, 'product-details.html'));
    this.cardRouter.init();
  }

  initFilters() {
    setTimeout(() => {
      const filtersDiv: HTMLDivElement | null = document.querySelector('.filters-wrapper');

      this.controller.getCategories((data?) => {
        if (data !== undefined && filtersDiv) {
          this.view.createFilterCaregories(data, filtersDiv);
        }
      });

      this.controller.getProducts((data?) => {
        if (data !== undefined && filtersDiv) {
          this.view.createFilterBrands(data, filtersDiv);
          this.view.createFilterPrice(data, filtersDiv, this.filtersObj);
        }
      });
    }, 50);

    setTimeout(() => {
      this.filtersListener();
    }, 1000);
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

  filtersListener() {
    const categoriesInput = document.getElementsByName('categories');
    const categoriesLabels = document.querySelectorAll('.categories__item');

    const brandInputs = document.getElementsByName('brands');
    const brandLabels = document.querySelectorAll('.brands__item');

    categoriesLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(categoriesInput, indx, this.filtersObj[Types.FilterName.CATEGORIES]);
        this.initCatalog();
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });

    brandLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(brandInputs, indx, this.filtersObj[Types.FilterName.BRANDS]);
        this.initCatalog();
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });
  }

  initCart() {
    setTimeout(() => {
      this.view.createCart();
    }, 50);
  }
}
