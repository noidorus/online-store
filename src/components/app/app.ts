// import LoadRoutes from '../route/loadRoutes';
import Route from '../route/route';
import Router from '../route/router';
import { Types } from '../types/Types';
import Init from './init';

class App {
  // loadRoutes: LoadRoutes;
  // init: Init;
  router: Router;

  constructor() {
    this.router = new Router([
      new Route('catalog', 'catalog.html', true),
      new Route('cart', 'cart.html'),
      new Route('404', '404.html'),
    ]);
    // this.loadRoutes = new LoadRoutes();
    // this.init = new Init();
  }

  start() {
    this.router.initRoutes();
    this.router.startRouter();
    // this.loadRoutes.init();
    // this.init.getData();
    // this.init.initApp();
    // this.init.initHeaderLinks();
    // this.init.initFilters();
    // this.init.initCatalog();
    // this.init.initProductDetails();
    // this.init.initCart();
  }
}

export default App;
