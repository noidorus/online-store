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
// const loadRoutes: LoadRoutes = new LoadRoutes();
// loadRoutes.init();
export default App;
