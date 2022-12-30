import AppController from '../controller/controller';
import AppView from '../appView/appView';
// import { Types } from '../types/Types';

export default class Init {
  controller: AppController;
  view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  init() {
    this.initHeaderLinks();
    this.initFilters();
    this.initCatalog();
    this.initCards(800);
  }

  initHeaderLinks() {
    const catalogLink = document.querySelector('.nav-list__item');
    catalogLink?.addEventListener('click', () => {
      this.initFilters();
      this.initCatalog();
      this.initCards(800);
    });
  }

  initCatalog() {
    setTimeout(() => {
      const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
      this.controller.getProducts((data?) => {
        if (data !== undefined && catalogDiv) {
          this.view.createCatalog(data, catalogDiv); // Function this.view.showProductDetails()
        }
      });
    }, 50);
  }

  initCards(sec: number) {
    setTimeout(() => {
      const productCards = document.querySelectorAll('.product-card');
      console.log('productCards: ', productCards);
      productCards.forEach((card) => {
        card.addEventListener('click', () => {
          window.location.hash = 'product-details';

          this.controller.getProductDetails(
            (data?) => {
              if (data !== undefined) {
                console.log('data: ', data); // Function this.view.showProductDetails()
              }
            },
            {
              id: 10, // Полученный Id
            }
          );
        });
      });
    }, sec);
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
          this.view.createFilterPrice(data, filtersDiv);
        }
      });
    }, 50);
  }
}
