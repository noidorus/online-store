import Loader from '../src/components/controller/loader';
import { Types } from '../src/components/types/Types';

describe('Loader test suite', () => {
  test('Check makeUrl', () => {
    const baseLink = 'https://dummyjson.com/products';
    const loader: Loader = new Loader(baseLink);
    const options = {
      category: { endpoint: Types.Endpoint.CATEGORIES },
      id: { id: 5 },
      default: {},
    };

    expect(loader.makeUrl(options.category)).toEqual('https://dummyjson.com/products/categories');
    expect(loader.makeUrl(options.id)).toEqual('https://dummyjson.com/products/5');
    expect(loader.makeUrl(options.default)).toEqual('https://dummyjson.com/products?limit=100&loading=lazy');
  });
});
