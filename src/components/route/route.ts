class Route {
  name: string;
  htmlName: string;
  default: boolean;

  constructor(name: string, htmlName: string, defaultRoute = false) {
    this.name = name;
    this.htmlName = htmlName;
    this.default = defaultRoute;
  }

  isActiveRoute(hashedPath: string): boolean {
    return hashedPath.replace('#', '') === this.name;
  }
}

export default Route;
