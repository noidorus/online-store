// class Router {
//   routes = [];
//   init(onRouteChange, onRouteNotFound) {
//     this.eventOnChange = onRouteChange;
//     this.eventOnNotFound = onRouteNotFound;

//     this.bindHasChange();
//     if (window.location.hash == '' || window.location.hash == '#') {
//       this.listener('#/');
//       return true;
//     } else {
//       this.listener(window.location.hash);
//     }
//     return true;
//   }

//   navigate(hash: string) {
//     window.location.hash = hash;
//   }

//   run(route) {
//     if (this.eventOnchange !== null) this.eventonChange(route);
//     this._run(route, 'before');
//   }

//   add(route, overwrite) {
//     let isAlreadyMapped = false;
//     if (!route.path) {
//       console.error('Cannot find property path when adding a new route!');
//       return false;
//     }
//     for (let i = 0; i < this.routes.length; i++) {
//       if (this.routes[i].path === route.path) {
//         isAlreadyMapped = true;
//         if (overwrite === true) {
//             this.routes[i] = route;
//             return true;
//         }
//         break;
//       }
//     }
//     if (isAlreadyMapped) {
//       console.error('A route for the path ' + route.path + ' is already mapped!');
//       return false;
//     }
//     this.routes.push(route);
//   }

//   findRoute(path) {
//     for (let i = 0; i < this.routes.length; i++) {
//       if (this.routes[i].path === path) return this.routes[i];
//     }
//   }

//   matchRoute(hash: string) {
//     let hashParts = this.cleanHash(hash);
//     let testerSlices = hashParts.hashParams.split("/");
//     let tester = hashParts.hashParams;
//     let params = {};
//     let query = {};

//     if (hashParts.hashQueryArray.length > 0) {
//       for (let q = 0; q < hashParts.hashQueryArray.length; q++) {
//         let keyValue = (hashParts.hashQueryArray[q]).split('=');
//         if (keyValue.length >= 1 && keyValue[0]) {
//           query[decodeURIComponent(keyValue[0])] = keyValue[1] ? decodeURIComponent(keyValue[1]) : '';
//         }
//       }
//     }

//     for (let i = 0; i < this.routes.length; i++) {
//       let route = this.routes[i];
//       tester = hashParts.hashParams;
      
//       if (route.path.search(/:/) > 0) {//Dynamic parts
//         let routeSlices = route.path.split("/");
//         for (let x = 0; x < routeSlices.length; x++) {
//           if ((x < testerSlices.length) && (routeSlices[x].charAt(0) === ":")) {
//             params[routeSlices[x].replace(/:/, '')] = testerSlices[x];
//             tester = tester.replace(testerSlices[x], routeSlices[x]);
//           }
//         }
//       }

//       if (route.path === tester) {
//         route.params = params;
//         route.url = hash;
//         route.query = query;
//         return route;
//       }
//     }
//     return null;
//   }

//   actualRoute() {
//     return this.matchRoute(window.location.hash);
//   }

//   _bindHashChange() {
//     window.onhashchange = () => {
//       this.listener(location.hash);
//     };
//   }

//   _cleanHash(hash: string) {
//     let result = {};
//     let hashIndexOfQuery = hash.indexOf('?');
//     result.hash = hash;
//     result.hashParams = hashIndexOfQuery >= 0 ? hash.substring(0, hashIndexOfQuery) : hash;
//     result.hashQuery = hashIndexOfQuery >= 0 ? hash.substring(hash.indexOf('?') + 1) : '';
//     result.hashQueryArray = result.hashQuery ? result.hashQuery.split('&') : [];
//     var cleanedHashParams = result.hashParams.replace(/\/+$/, '');
//     if (result.hashParams !== cleanedHashParams) {
//       window.onhashchange = null;
//       result.hash = cleanedHashParams;
//       result.hash += result.hashQuery ? '?' + result.hashQuery : '';
//       window.location.hash = result.hash;
//       this.bindHashChange();
//     }
//     return result;
//   }

//   _listener(hash: string) {
//     let route = this.matchRoute(hash);
//       if (!route && !this.eventOnNotFound) {
//       console.error('Cannot find a valid route for hash ' + hash + '!');
//         return false;
//       } else if (!route && this.eventOnNotFound) {
//         this.eventOnNotFound(this.hashToArray(hash));
//         return false;
//       }
//     return this.run(route);
//   }

//   _hashToArray(hash: string) {
//     const tokens = hash.split('/');
//     if (tokens.length > 0 && tokens[0] == '#') tokens.shift();
//     return tokens;
//   }

//   _run(route, state, previousResult) {
//     if (route[state]) {
//       let runTask = new Router.__task(function (result) {
//         let nextState = Router.__nextState(state);
//         if (nextState) Router.__run(route, nextState, result);
//       });
//       route.event = {};
//       route.event.previousResult = previousResult;
//       route.event.state = state;
//       route.task = runTask;
//       route[state]();
//     } else {
//       let nextState = Router.__nextState(state);
//       if (nextState) Router.__run(route, nextState);
//     }
//   }

//   _nextState(state) {
//     if (state == 'before') return 'on';
//     if (state == 'on') return 'after';
//     return null;
//   }

//   eventOnChange = null,
//   eventOnNotFound = null,
//   _task(doneFunction) {
//       return {
//           _callback: doneFunction,
//           ///Send a signal to task to execute callback function
//           done: function (result) {
//               this._callback(result);
//           }
//       }
//   },
// }