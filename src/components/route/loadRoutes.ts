import Route from './route';
import Router from './router';

class LoadRoutes {
  init() {
    const router: Router = new Router([
      new Route('catalog', 'catalog.html', true),
      new Route('cart', 'cart.html'),
      new Route('product-details', 'product-details.html'),
    ]);
    console.log(router);
    router.init();
  }
}

export default LoadRoutes;
