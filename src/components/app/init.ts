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
    const cartLink = document.querySelector('.shopping-cart');

    catalogLink?.addEventListener('click', () => {
      window.onhashchange = () => {
        this.initCatalog();
        this.initFilters();
      }
    });

    cartLink?.addEventListener('click', () => {
      window.location.hash = '#cart';
      window.onhashchange = () => {
        this.initCart();
      }
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
          this.view.createCatalog(data, catalogDiv);
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
    }, 50);
  }

  initCart() {
    setTimeout(() => {
      this.view.createCart();
    }, 50);
  }
}
