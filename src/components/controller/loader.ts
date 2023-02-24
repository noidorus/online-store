import { Types } from '../types/Types';

class Loader {
  baseLink: string;

  constructor(baseLink: string) {
    this.baseLink = baseLink;
  }

  getResp(
    callback = () => {
      console.error('No callback for GET response');
    },
    options: Types.IOptions
  ): void {
    this.load(callback, options);
  }

  makeUrl(options: Types.IOptions): string {
    if (Object.keys(options).length !== 0) {
      switch (options.endpoint) {
        case Types.Endpoint.CATEGORIES:
          return `${this.baseLink}/categories`;
        case Types.Endpoint.CATEGORY:
          return `${this.baseLink}/category/${options.caterory}`;
        case Types.Endpoint.SEARCH:
          return `${this.baseLink}/search?q=${options.search}`;
        default:
          return `${this.baseLink}/${options.id}`;
      }
    } else {
      return `${this.baseLink}?limit=100&loading=lazy`;
    }
  }

  load(callback: Types.CallBackType, options: Types.IOptions): void {
    fetch(this.makeUrl(options))
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
}

export default Loader;
