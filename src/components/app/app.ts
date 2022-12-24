import LoadRoutes from '../route/loadRoutes';
import AppController from '../controller/controller';
// import { Types } from '../types/Types';

class App {
  loadRoutes: LoadRoutes;
  controller: AppController;

  constructor() {
    this.loadRoutes = new LoadRoutes();
    this.controller = new AppController();
  }

  start() {
    this.loadRoutes.init();

    this.controller.getProducts((data?) => {
      if (data !== undefined) {
        console.log(data);
      }
    });

    this.controller.getProductDetails(
      (data?) => {
        if (data !== undefined) {
          console.log(data);
        }
      },
      {
        id: 5, // Полученный Id
      }
    );
  }
}

export default App;
