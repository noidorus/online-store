import LoadRoutes from '../route/loadRoutes';

class App {
  loadRoutes: LoadRoutes;
  constructor() {
    this.loadRoutes = new LoadRoutes();
  }

  start(): void {
    this.loadRoutes.init();
  }
}

export default App;
