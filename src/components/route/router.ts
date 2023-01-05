import Init from '../app/init';
// import AppView from '../appView/appView';
// import AppController from '../controller/controller';
import Route from './route';

class Router {
  routes: Route[];
  // view: AppView;
  rootElem: HTMLDivElement;
  init: Init;
  // controller: AppController;

  constructor(routes: Route[]) {
    this.routes = routes;
    this.init = new Init();
    // this.view = new AppView();
    // this.controller = new AppController();
    this.rootElem = document.getElementById('app') as HTMLDivElement;
  }

  initRoutes() {
    this.init.getData(this.routes, () => {
      this.initPaths();
    });
  }

  startRouter() {
    window.addEventListener('hashchange', () => {
      this.initPaths();
    });
  }

  initPaths() {
    if (window.location.hash == '#cart') {
      this.hasChanged(this.routes, () => {
        this.init.initCart();
      });
    }
    if (window.location.hash == '#catalog' || window.location.hash == '') {
      this.hasChanged(this.routes, () => {
        this.init.initFilters();
        this.init.initCatalog();
      });
    }
    if (window.location.hash.match(/^(\#product-details\/(100|[1-9][0-9]?))$/g)) {
      this.hasChanged(this.routes, () => {
        this.init.initProductDetails();
      });
    }
  }

  // startRouter(callback: () => void) {
  //   window.addEventListener('hashchange', () => {
  //     if (window.location.hash == '#cart') {
  //       this.hasChanged(this.routes, () => {
  //         this.view.createCart();
  //       });
  //     } else if (window.location.hash.match(/^(\#product-details\/(100|[1-9][0-9]?))$/g)) {
  //       this.hasChanged(this.routes, () => {
  //         this.init.initProductDetails();
  //       });
  //     } else {
  //       this.hasChanged(this.routes, callback);
  //     }
  //   });
  //   this.hasChanged(this.routes, callback);
  // }

  hasChanged(r: Route[], callback: () => void) {
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

  // goToRoute(scope: Router, htmlName: string) {
  //   let url = `components/views/${htmlName}`;
  //   if (!this.checkValidity(htmlName)) {
  //     url = `components/views/404.html`;
  //   }
  //   const xhttp = new XMLHttpRequest();

  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       scope.rootElem.innerHTML = this.responseText;
  //     }
  //   };
  //   xhttp.open('GET', url, true);
  //   xhttp.send();
  // }

  async goToRoute(htmlName: string, callback: () => void) {
    const url = `components/views/${htmlName}`;
    const html = await fetch(url).then((res) => res.text());
    console.log('routed');
    this.rootElem.innerHTML = html;
    callback();
  }

  checkValidity(htmlName: string) {
    return this.routes.find((route) => route.htmlName == htmlName);
  }
}

export default Router;
