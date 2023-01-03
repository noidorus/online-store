// import LoadRoutes from '../route/loadRoutes';
import { Types } from '../types/Types';
import Init from './init';

class App {
  // loadRoutes: LoadRoutes;
  init: Init;

  constructor() {
    // this.loadRoutes = new LoadRoutes();
    this.init = new Init();
  }

  start() {
    // this.loadRoutes.init();
    this.init.getData();
    // this.init.initApp();
    // this.init.initHeaderLinks();
    // this.init.initFilters();
    // this.init.initCatalog();
    // this.init.initProductDetails();
    // this.init.initCart();
  }
}

export default App;
