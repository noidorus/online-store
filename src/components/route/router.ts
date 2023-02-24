import Init from '../app/init';
import Route from './route';

class Router {
  routes: Route[];
  rootElem: HTMLDivElement;
  init: Init;

  constructor(routes: Route[]) {
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
    window.addEventListener('hashchange', () => {
      this.initPaths();
    });
  }

  initPaths(): void {
    if (window.location.hash == '#cart') {
      this.hasChanged(this.routes, () => {
        this.init.initCart();
      });
    } else if (window.location.hash == '#catalog' || window.location.hash == '') {
      this.hasChanged(this.routes, () => {
        this.init.initMainPage();
      });
    } else if (window.location.hash.match(/^(\#product-details\/(100|[1-9][0-9]?))$/g)) {
      this.hasChanged(this.routes, () => {
        this.init.initProductDetails();
      });
    } else {
      this.goToRoute('404.html', () => {
        console.log('path not found');
      });
    }
  }

  hasChanged(r: Route[], callback: () => void): void {
    if (window.location.hash.length > 0) {
      for (let i = 0, length = r.length; i < length; i += 1) {
        const route = r[i];

        if (route.isActiveRoute(window.location.hash.substring(1))) {
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
    console.log('routed');
    this.rootElem.innerHTML = html;
    callback();
  }
}

export default Router;
