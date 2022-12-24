import LoadRoutes from '../route/loadRoutes';
import AppController from '../controller/controller';

class App {
  loadRoutes: LoadRoutes;
  controller: AppController;

  constructor() {
    this.loadRoutes = new LoadRoutes();
    this.controller = new AppController();
  }

  start() {
    this.loadRoutes.init();
    this.controller.load();
  }
}

export default App;
