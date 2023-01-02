import LoadRoutes from '../route/loadRoutes';
import { Types } from '../types/Types';
import Init from './init';

class App {
  loadRoutes: LoadRoutes;
  init: Init;
  cache: Types.Product[] = [];

  constructor() {
    this.loadRoutes = new LoadRoutes();
    this.init = new Init();
  }

  start() {
    this.loadRoutes.init();
    this.init.initHeaderLinks();
    this.init.initFilters();
    this.init.initCatalog();
    this.init.initProductDetails();
  }
}

export default App;
