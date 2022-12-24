import Loader from './loader';
const baseLink = 'https://dummyjson.com/products?limit=100';

class LoadData extends Loader {
  constructor() {
    super(baseLink);
  }
}

export default LoadData;
