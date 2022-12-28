import LoadRoutes from '../route/loadRoutes';
// import AppController from '../controller/controller';
// import { Types } from '../types/Types';
// import AppView from '../appView/appView';
import Init from './init';

class App {
  loadRoutes: LoadRoutes;
  // controller: AppController;
  // view: AppView;
  init: Init;

  constructor() {
    this.loadRoutes = new LoadRoutes();
    // this.controller = new AppController();
    // this.view = new AppView();
    this.init = new Init();
  }

  start() {
    this.loadRoutes.init();
    this.init.initHeaderLinks();
    this.init.initCards();
    this.init.initFilters();
    this.init.initCatalog();
  }
}

export default App;
