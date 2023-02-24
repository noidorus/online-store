/**
 * @jest-environment jsdom
 */
import ProductDetails from '../src/components/appView/productDetails';
import Cart from '../src/components/appView/cart';

describe('ProductDetails test suite', () => {
  const prodDetails = new ProductDetails(new Cart());

  test('Test drawCrumbs() ', () => {
    document.body.innerHTML = '';
    const data = {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
      images: [
        'https://i.dummyjson.com/data/products/1/1.jpg',
        'https://i.dummyjson.com/data/products/1/2.jpg',
        'https://i.dummyjson.com/data/products/1/3.jpg',
        'https://i.dummyjson.com/data/products/1/4.jpg',
        'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
      ],
    };
    document.body.innerHTML = `<div class="div"></div`;
    const div = <HTMLDivElement>document.querySelector('.div');

    for (let i = 0; i < 4; i += 1) {
      const crumb = document.createElement('div');
      crumb.className = 'crumb';
      div.append(crumb);
    }
    prodDetails.drawCrumbs(data);

    expect(document.querySelector('.div')?.innerHTML).toEqual(
      `<div class="crumb"></div><div class="crumb">Smartphones</div><div class="crumb">Apple</div><div class="crumb">iPhone 9</div>`
    );
  });

  test('Test createMagnifyerDiv', () => {
    document.body.innerHTML = '';
    prodDetails.createMagnifyerDiv();
    expect(document.body.innerHTML).toEqual(`<div class="modal-prodDetails"></div>`);
  });
});
