/**
 * @jest-environment jsdom
 */
import Router from '../src/components/route/router';
import Route from '../src/components/route/route';

document.body.innerHTML = `<div id="app"></div>`;

const router = new Router([
  new Route('catalog', 'catalog.html', true),
  new Route('cart', 'cart.html'),
  new Route('404', '404.html'),
  new Route('product-details', 'product-details.html'),
]);

describe('Router test suite', () => {
  test('Test - checkValidity()', () => {
    expect(router.checkValidity('cart.html')).toEqual({
      default: false,
      htmlName: 'cart.html',
      name: 'cart',
    });
    expect(router.checkValidity('catalog.html')).toEqual({
      default: true,
      htmlName: 'catalog.html',
      name: 'catalog',
    });
    expect(router.checkValidity('404.html')).toEqual({
      default: false,
      htmlName: '404.html',
      name: '404',
    });
    expect(router.checkValidity('product-details.html')).toEqual({
      default: false,
      htmlName: 'product-details.html',
      name: 'product-details',
    });
  });
});
