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

  initRoutes() {
    this.init.getData(this.routes, () => {
      this.initPaths();
    });
  }

  startRouter() {
    // window.onpopstate = (e: PopStateEvent) => {
    //   e.preventDefault();
    //   console.log('change to 404');
    //   document.title = 'sdfg';
    //   this.rootElem.innerHTML = '';
    //   this.rootElem.innerHTML = `<div class="store-404">
    //   <h2 class="header--important">Whoops!</h2>
    //   <p class="subtext">404 Page Not Found</p>
    //   <p class="main-text">We cant seem to find what you are looking for.</p>
    //   <p class="main-text">Try out our <a href="">catalog</a> instead.</p>
    // </div>`;
    //   window.history.pushState({}, '', `/page404`);
    //   // location.reload();
    //   if (window.location.pathname == '/page404') {
    //     console.log('change to 404');
    //   document.title = 'sdfg';
    //   this.rootElem.innerHTML = '';
    //   this.rootElem.innerHTML = `<div class="store-404">
    //   <h2 class="header--important">Whoops!</h2>
    //   <p class="subtext">404 Page Not Found</p>
    //   <p class="main-text">We cant seem to find what you are looking for.</p>
    //   <p class="main-text">Try out our <a href="">catalog</a> instead.</p>
    // </div>`;
    //   }
    // };
    window.addEventListener('popstate', () => {
      this.initPaths();
    });
  }

  initPaths() {
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

  hasChanged(r: Route[], callback: () => void) {
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

  async goToRoute(htmlName: string, callback: () => void) {
    const url = `components/views/${htmlName}`;
    const html = await fetch(url).then((res) => res.text());
    console.log('routed');
    this.rootElem.innerHTML = html;
    callback();
  }
}

export default Router;
