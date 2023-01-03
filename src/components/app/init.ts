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
        this.initCatalog(this.cache);
        this.initFilters(this.cache);
      });
    } else if (window.location.hash == '#cart') {
      this.router.init(() => {
        this.initCart();
      });
    } else if (window.location.hash.match(/^(\#product-details\/(100|[1-9][0-9]?))$/g)) {
      // this.initProductDetails(this.cache);
    }
  }

  initCatalog(data: Types.Product[]) {
    const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
    if (data !== undefined && catalogDiv) {
      catalogDiv.innerHTML = '';
      this.view.createCatalog(data, catalogDiv, this.filtersObj);
    }
  }

  initCart() {
    const cartDiv = document.querySelector('.cart');
    if (cartDiv) {
      this.view.createCart();
    }
  }

  // initHeaderLinks() {
  //   // const catalogLink = document.querySelector('.nav-list__item');
  //   // const cartLink = document.querySelector('.shopping-cart');
  //   // catalogLink?.addEventListener('click', () => {
  //   //   window.onhashchange = () => {
  //   //     this.initCatalog();
  //   //     this.initFilters();
  //   //   };
  //   // });
  //   // cartLink?.addEventListener('click', () => {
  //   //   this.initCart();
  //   // });
  // }

  // // initCatalog() {

  // // }

  // initCatalog() {
  //   setTimeout(() => {
  //     const catalogDiv: HTMLDivElement | null = document.querySelector('.cards-wrapper');
  //     this.controller.getProducts((data?) => {
  //       if (data !== undefined && catalogDiv) {
  //         catalogDiv.innerHTML = '';
  //         this.view.createCatalog(data, catalogDiv, this.filtersObj);
  //         this.view.createToggle();
  //         this.selectCards();
  //         this.cardRouter.init();
  //       } else if (data !== undefined) {
  //         for (let i = 0; i < data.products.length; i++) {
  //           this.makeRoute(data.products[i].id);
  //         }
  //         this.cardRouter.init();
  //       }
  //     });
  //   }, 50);
  // }

  // selectCards() {
  //   const productCards = document.querySelectorAll('.product-card');
  //   productCards.forEach((el) => {
  //     this.makeRoute(Number(el.id.split('-')[1]));
  //     this.initCardLinks(el);
  //   });
  // }

  // initCardLinks(el: Element) {
  //   el.addEventListener('click', (e) => {
  //     if (e.target) {
  //       const eventTarget = <HTMLDivElement>e.target;
  //       if (
  //         !eventTarget.classList.contains('card-cart-img') &&
  //         !eventTarget.classList.contains('card-cart') &&
  //         !eventTarget.classList.contains('card-bottom-wrapper')
  //       ) {
  //         window.location.hash = `#product-details/${el.id.split('-')[1]}`;
  //         this.initProductDetails();
  //       }
  //     }
  //   });
  // }

  // initProductDetails() {
  //   setTimeout(() => {
  //     const windowHash = window.location.hash.split('/');
  //     if (windowHash[0] === '#product-details') {
  //       const productWrapperDiv: HTMLDivElement | null = document.querySelector('.product-wrapper');
  //       this.controller.getProductDetails(
  //         (data?) => {
  //           if (data !== undefined && productWrapperDiv) {
  //             this.view.showProductDetails(data);
  //           }
  //         },
  //         {
  //           id: Number(windowHash[windowHash.length - 1]),
  //         }
  //       );
  //     }
  //   }, 500);
  // }

  // makeRoute(elId: number) {
  //   this.cardRouter.routes.push(new Route(`product-details/${elId}`, 'product-details.html'));
  // }

  initFilters(cache: Types.Product[]) {
    const filtersDiv: HTMLDivElement | null = document.querySelector('.filters-wrapper');
    if (cache !== undefined && filtersDiv) {
      this.view.createFilters(cache, 'brands');
      this.view.createFilters(cache, 'category');
      
      this.filtersListener();
      // this.view.createFilterCaregories(data, filtersDiv);
      // this.view.createFilterBrands(data, filtersDiv);
      // this.view.createFilterPrice(data, filtersDiv, this.filtersObj);

    }
    // this.controller.getCategories((data?) => {
    //   if (data !== undefined && filtersDiv) {
    //   }
    // });

    // this.controller.getProducts((data?) => {
    //   if (data !== undefined && filtersDiv) {
    //   }
    // });
    // setTimeout(() => {
    // }, 50);
    console.log(document.querySelectorAll('.categories__item'));
    // setTimeout(() => {
    // }, 1000);
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
    const categoriesInput = document.getElementsByName('category');
    const categoriesLabels = document.querySelectorAll('.category__item');

    const brandInputs = document.getElementsByName('brands');
    const brandLabels = document.querySelectorAll('.brands__item');
    categoriesLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(categoriesInput, indx, this.filtersObj.categories);
        this.initCatalog(this.cache);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });

    brandLabels.forEach((label, indx) => {
      label.addEventListener('input', () => {
        this.changeCheckboxes(brandInputs, indx, this.filtersObj.brands);
        this.initCatalog(this.cache);
        console.log('this.filtersObj: ', this.filtersObj);
      });
    });
  }
}
