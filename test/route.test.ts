/**
 * @jest-environment jsdom
 */
import Route from '../src/components/route/route';

test('Test isActiveRoute() ', () => {
  const route1 = new Route('catalog', 'catalog.html', true);
  const route2 = new Route('cart', 'cart.html');

  document.body.innerHTML = `
    <button class="btn1" href="#catalog">Go to Route</button>
    <button class="btn2" href="#cart">Go to Route</button>
  `;

  const btn1: HTMLButtonElement | null = document.querySelector('.btn');
  const btn2: HTMLButtonElement | null = document.querySelector('.btn');

  btn1?.addEventListener('click', () => {
    window.location.hash = '#catalog';
  });
  if (btn1) {
    btn1.click();
    expect(route1.isActiveRoute(window.location.hash)).toEqual(true);
  }

  btn2?.addEventListener('click', () => {
    window.location.hash = '#cart';
  });
  if (btn2) {
    btn2.click();
    expect(route2.isActiveRoute(window.location.hash)).toEqual(true);
  }
});
