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

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
    this.filtersObj = {
      categories: [],
    };
  }

  // init() {
  //   this.initHeaderLinks();
  //   this.initFilters();
  //   this.initCatalog();
  // }

  initHeaderLinks() {
    const catalogLink = document.querySelector('.nav-list__item');
    catalogLink?.addEventListener('click', () => {
      this.initFilters();
      this.initCatalog();
    });
  }

  initCatalog() {
    setTimeout(() => {
      const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
      this.controller.getProducts((data?) => {
        if (data !== undefined && catalogDiv) {
          catalogDiv.innerHTML = '';
          this.view.createCatalog(data, catalogDiv, this.filtersObj); // Function this.view.showProductDetails()
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
      this.makeRoute(Number(el.id));
      this.initCardLinks(el);
    });
  }

  initCardLinks(el: Element) {
    el.addEventListener('click', () => {
      this.initProductDetails();
    });
  }

  initProductDetails() {
    setTimeout(() => {
      const windowHash = window.location.hash.split('/');
      console.log(windowHash[0] === '#product-details');
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
          this.view.createFilterBrands(data, filtersDiv, this.filtersObj);
          this.view.createFilterPrice(data, filtersDiv, this.filtersObj);
        }
      });

      console.log('this.filtersObj: ', this.filtersObj);
    }, 50);

    setTimeout(() => {
      this.filtersListener();
    }, 500);
  }

  filtersListener() {
    const categoriesInput = document.getElementsByName('categories');
    const labels = document.querySelectorAll('.categories__item');

    console.log('labels: ', labels);
    console.log('categories: ', categoriesInput);

    labels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        const checkbox = categoriesInput[indx] as HTMLInputElement;
        const categoriesArr = this.filtersObj.categories;

        if (checkbox.checked) {
          categoriesArr.push(checkbox.value);
        } else {
          const idx = categoriesArr.indexOf(checkbox.value);
          categoriesArr.splice(idx, 1);
        }

        this.initCatalog();
        console.log(this.filtersObj, (categoriesInput[indx] as HTMLInputElement).checked);
      });
    });
  }
}
