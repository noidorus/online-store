import { IRoute } from "../types/interfaces";

class Route implements IRoute {
  public name: string;

  public htmlName: string;

  public default: boolean;

  constructor(name: string, htmlName: string, defaultRoute = false) {
    this.name = name;
    this.htmlName = htmlName;
    this.default = defaultRoute;
  }

  isActiveRoute(path: string): boolean {
    return path.replace('/', '') === this.name;
  }
}

export default Route;
