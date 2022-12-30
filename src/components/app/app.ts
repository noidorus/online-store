import LoadRoutes from '../route/loadRoutes';
import Init from './init';

class App {
  loadRoutes: LoadRoutes;
  init: Init;

  constructor() {
    this.loadRoutes = new LoadRoutes();
    // this.controller = new AppController();
    // this.view = new AppView();
    this.init = new Init();
  }

  start() {
    this.loadRoutes.init();
    this.init.init();
  }
}

export default App;
