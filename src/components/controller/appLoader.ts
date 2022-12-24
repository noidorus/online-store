import Loader from './loader';
const baseLink = 'https://dummyjson.com/products';

class LoadData extends Loader {
  constructor() {
    super(baseLink);
  }
}

export default LoadData;
