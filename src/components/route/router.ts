import Init from '../app/init';
import { IRoute } from '../types/interfaces';

class Router {
  public routes: IRoute[];

  public rootElem: HTMLDivElement;

  public init: Init;

  constructor(routes: IRoute[]) {
    this.routes = routes;
    this.init = new Init();
    this.rootElem = document.getElementById('app') as HTMLDivElement;
  }

  initRoutes(): void {
    this.init.getData(this.routes, () => {
      this.initPaths();
    });
  }

  startRouter(): void {
    window.addEventListener('popstate', () => {
      this.initPaths();
    });
  }

  initPaths(): void {
    if (window.location.pathname == '/cart') {
      this.hasChanged(this.routes, () => {
        this.init.initCart();
      });
    } else if (window.location.pathname == '/catalog' || window.location.pathname == '/') {
      this.hasChanged(this.routes, () => {
        this.init.initMainPage();
      });
    } else if (window.location.pathname.match(/^(\/product-details\-(100|[1-9][0-9]?))$/g)) {
      this.hasChanged(this.routes, () => {
        this.init.initProductDetails();
      });
    } else {
      window.history.pushState({}, '', `/page404`);
      this.goToRoute('404.html', () => {
        console.log('path not found');
      });
    }
  }

  hasChanged(r: IRoute[], callback: () => void): void {
    if (window.location.pathname.length > 1) {
      for (let i = 0, length = r.length; i < length; i += 1) {
        const route = r[i];
        if (route.isActiveRoute(window.location.pathname.substring(1))) {
          this.goToRoute(route.htmlName, callback);
        }
      }
    } else {
      for (let i = 0, length = r.length; i < length; i += 1) {
        const route = r[i];
        if (route.default) {
          this.goToRoute(route.htmlName, callback);
        }
      }
    }
  }

  async goToRoute(htmlName: string, callback: () => void): Promise<void> {
    const url = `components/views/${htmlName}`;
    const html = await fetch(url).then((res) => res.text());
    this.rootElem.innerHTML = html;
    callback();
  }
}

export default Router;
