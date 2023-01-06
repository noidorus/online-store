import Route from '../route/route';
import Router from '../route/router';

class App {
  router: Router;

  constructor() {
    this.router = new Router([
      new Route('catalog', 'catalog.html', true),
      new Route('cart', 'cart.html'),
      new Route('404', '404.html'),
    ]);
  }

  start() {
    this.router.initRoutes();
    this.router.startRouter();
  }
}

export default App;
