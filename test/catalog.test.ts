/**
 * @jest-environment jsdom
 */
import Catalog from '../src/components/appView/catalog';

describe('Catalog test suite', () => {
  const catalog = new Catalog();

  test('Test drawCategory() ', () => {
    document.body.innerHTML = `
    <div class="categories"></div>
    <div class="categories2"></div>
    <div class="brands"></div>`;

    const categories = <HTMLDivElement>document.querySelector('.categories');
    const categories2 = <HTMLDivElement>document.querySelector('.categories2');
    const brands = <HTMLDivElement>document.querySelector('.brands');

    catalog.drawCategory('laptops', categories, 'category');
    catalog.drawCategory('new-category', categories2, 'category');
    catalog.drawCategory('Apple', brands, 'brand');

    expect(categories.innerHTML).toEqual(
      `<label class="checkbox__item category__item">Laptops<input class="checkbox__item-input category__item-input" type="checkbox" name="category" value="laptops"><span class="checkmark"></span></label>`
    );
    expect(categories2.innerHTML).toEqual(
      `<label class="checkbox__item category__item">New Category<input class="checkbox__item-input category__item-input" type="checkbox" name="category" value="new-category"><span class="checkmark"></span></label>`
    );
    expect(brands.innerHTML).toEqual(
      `<label class="checkbox__item brand__item">Apple<input class="checkbox__item-input brand__item-input" type="checkbox" name="brand" value="Apple"><span class="checkmark"></span></label>`
    );
  });

  test('Test drawCard()', () => {
    const div = document.createElement('div');
    const product = {
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

    catalog.drawCard(product, div);

    expect(div.innerHTML).toEqual(
      `<div class="product-card" id="product-1"><img class="card-image" src="https://i.dummyjson.com/data/products/1/thumbnail.jpg"><div class="card-txt-wrapper"><div class="card-top-wrapper"><h4 class="card-price">$549</h4><a href="#product-details/1" class="product-card__link">More</a></div><h4 class="card-title">iPhone 9</h4><p class="card-description">An apple mobile which is nothing like apple</p><div class="card-bottom-wrapper"><div class="card-rating"><div class="card-rating-star"></div><p class="card-rating-txt">4.69</p></div><div class="card-cart"><img class="card-cart-img" src="./assets/icons/add-to-cart-icon.svg"></div></div></div></div>`
    );
  });

  test('Test fillSliderTrack() ', () => {
    document.body.innerHTML = `
      <input type="range" min="1" max="10" value="2" class="minInput"></input>
      <input type="range" min="1" max="10" value="9" class="maxInput"></input>
    `;

    const minInput = <HTMLInputElement>document.querySelector('.minInput');
    const maxInput = <HTMLInputElement>document.querySelector('.maxInput');

    expect(catalog.fillSliderTrack(minInput, maxInput)).toEqual(
      `Linear-Gradient(To Right, #Dadae5 11% , #8e2de2 11% , #8e2de2 88%, #Dadae5 88%)`
    );
  });
});
