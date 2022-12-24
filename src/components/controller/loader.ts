import { DataTypes } from '../types/Data';

class Loader {
  baseLink: string;
  data: DataTypes.Product | null;

  constructor(baseLink: string) {
    this.baseLink = baseLink;
    this.data = null;
  }

  getResp(options, callback = () => {
      console.error('No callback for GET response');
    }
  ) {
    this.load(options, callback);
  }

  async load(options, callback) {
    const response = await fetch(this.baseLink);
    const data: DataTypes.RootObject = await response.json();

    if (data !== null) {
      this.data = data.products;
    }
    console.log(this.data);
  }
}

export default Loader;
