import AppController from '../controller/controller';
import AppView from '../appView/appView';
import Router from '../route/router';
import Route from '../route/route';

export default class Init {
  controller: AppController;

  view: AppView;

  cardRouter: Router = new Router([]);

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  initHeaderLinks() {
    const catalogLink = document.querySelector('.nav-list__item');
    catalogLink?.addEventListener('click', () => {
      this.initCatalog();
      this.initFilters();
    });
  }

  initCatalog() {
    // const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');

    // this.controller.getProducts((data) => {
    //   if (data !== undefined && catalogDiv) {
    //     this.view.createCatalog(data, catalogDiv);
    //   }
    // });
    setTimeout(() => {
      const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
      this.controller.getProducts((data?) => {
        if (data !== undefined && catalogDiv) {
          this.view.createCatalog(data, catalogDiv); // Function this.view.showProductDetails()
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
      console.log(el.id);
      this.initProductDetails();
    });
  }

  initProductDetails() {
    setTimeout(() => {
      const windowHash = window.location.hash.split('/');
      console.log(windowHash[0] === '#product-details');
      if (windowHash[0] === '#product-details') {
        const productWrapperDiv: HTMLDivElement | null = document.querySelector('.product-wrapper');
        this.controller.getProductDetails((data?) => {
            if (data !== undefined && productWrapperDiv) {
              this.view.showProductDetails(data);
            }
          },
          {
            id: Number(windowHash[windowHash.length - 1]),
          }
        );
      }
    }, 300);
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
    }, 50);
  }
}
