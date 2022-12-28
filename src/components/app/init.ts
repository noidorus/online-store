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

  initHeaderLinks() {
    const catalogLink = document.querySelector('.nav-list__item');
    catalogLink?.addEventListener('click', () => {
      this.initCards();
      this.initFilters();
      this.initCatalog();
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

  initCards() {
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
    }, 500);
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
