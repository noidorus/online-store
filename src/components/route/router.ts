import Route from './route';

class Router {
  routes: Route[];

  rootElem: HTMLDivElement;

  constructor(routes: Route[]) {
    this.routes = routes;

    this.rootElem = document.getElementById('app') as HTMLDivElement;
  }

  init() {
    const r = this.routes;
    (function (scope, r) {
      window.addEventListener('hashchange', () => {
        scope.hasChanged(scope, r);
      });
    })(this, r);
    this.hasChanged(this, r);
  }

  hasChanged(scope: this, r: Route[]) {
    if (window.location.hash.length > 0) {
      for (let i = 0, length = r.length; i < length; i += 1) {
        const route = r[i];

        if (route.isActiveRoute(window.location.hash.substring(1))) {
          scope.goToRoute(route.htmlName);
        }
      }
    } else {
      for (let i = 0, length = r.length; i < length; i += 1) {
        const route = r[i];
        if (route.default) {
          scope.goToRoute(route.htmlName);
        }
      }
    }
  }

  goToRoute(htmlName: string) {
    (function (scope) {
      const url = `components/views/${htmlName}`;
      const xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          scope.rootElem.innerHTML = this.responseText;
        }
      };
      xhttp.open('GET', url, true);
      xhttp.send();
    })(this);
  }
}

export default Router;
