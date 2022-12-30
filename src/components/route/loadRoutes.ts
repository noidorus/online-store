import Route from './route';
import Router from './router';

class LoadRoutes {
  router: Router = new Router([]);

  init() {
    this.router.routes.push(
      new Route('catalog', 'catalog.html', true),
      new Route('cart', 'cart.html'),
      new Route('product-details', 'product-details.html'),
      new Route('404', '404.html')
    );
    this.router.init();
  }
}

export default LoadRoutes;
