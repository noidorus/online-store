import Loader from '../src/components/controller/loader';
import { Types } from '../src/components/types/Types';

describe('Loader test suite', () => {
  test('Check makeUrl', () => {
    const baseLink = 'https://dummyjson.com/products';
    const loader: Loader = new Loader(baseLink);
    const options1 = {
      endpoint: Types.Endpoint.CATEGORIES,
    };

    const options2 = {
      id: 5,
    };

    const options3 = {};

    expect(loader.makeUrl(options1)).toEqual('https://dummyjson.com/products/categories');
    expect(loader.makeUrl(options2)).toEqual('https://dummyjson.com/products/5');
    expect(loader.makeUrl(options3)).toEqual('https://dummyjson.com/products?limit=100');
  });
});
