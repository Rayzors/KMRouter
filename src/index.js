export class Router {
  /**
   * @description Creates an instance of Router.
   * @param {string|object} container
   * @param {object[]} routes
   * @memberof Router
   */
  constructor(container, routes) {
    this.container = this._checkContainerType(container);
    this.routes = this._checkRoutesType(routes);
    this.params = {};
    this._checkPathExist();
    this.routes.forEach((route) => {
      route.path = this._formatPath(route.path);
    });
    this._initEvent();
  }

  /**
   * @description Initialise les écouteurs d'evenement
   * @memberof Router
   */
  _initEvent() {
    window.addEventListener('load', this._render.bind(this));
    window.addEventListener('popstate', this._render.bind(this));
    this.container.addEventListener(
      'click',
      this._triggerRouterLink.bind(this)
    );
  }

  /**
   * @description Vérifie si la route est bien formatée
   * @param {String} path
   * @returns {String}
   * @memberof Router
   */
  _formatPath(path) {
    if (path.match(/^(\/\#|\#\/)/) !== null) {
      throw `bad url \`${path}\``;
    }
    if (path === '') {
      return '/';
    }
    if (path.match(/^\//) === null) {
      return `/${path}`;
    }
    return path;
  }

  /**
   * @description Vérifie le container est une string ou un object
   * @param {String} path
   * @memberof Router
   */
  _checkContainerType(container) {
    if (typeof container === 'string') {
      return document.querySelector(container);
    } else if (!Array.isArray(container)) {
      return container;
    } else {
      throw 'The first argument must be an element or a string selector';
    }
  }

  /**
   * @description Vérifie les routes est un tableau d'objets
   * @param {String} path
   * @memberof Router
   */
  _checkRoutesType(routes) {
    if (Array.isArray(routes)) {
      let isObjectArray = routes.every(
        (route) => typeof route === 'object' && !Array.isArray(route)
      );
      if (!isObjectArray) {
        throw 'The second argument must be an array of object';
      }
      return routes;
    }
    throw 'The second argument must be an array of object';
  }

  /**
   * @description Vérifie si chaque route a une clé "path"
   * @param {String} path
   * @memberof Router
   */
  _checkPathExist(path) {
    this.routes.forEach((route, i) => {
      if (!route.hasOwnProperty('path')) {
        throw `path is missing on route number \`${i}\``;
      }
    });
  }

  /**
   * @description Récupère l'objet de la route courante puis rend la page courante
   * @memberof Router
   */
  _render() {
    let match = this._match(window.location.pathname, this.routes);

    if (match && match.hasOwnProperty('redirect')) {
      this.redirect(match.redirect);
    } else if (match) {
      this.container.innerHTML = match.controller();
    } else {
      this.redirect();
    }
  }

  /**
   * @description Vérifie si l'url existe parmi les routes
   * @param {String} url
   * @param {Array} routes
   * @returns {Object} Retourne l'objet de la route correspondante
   * @memberof Router
   */
  _match(url, routes) {
    return routes.find(({ path }) => {
      const generatedURLRegExp = this._generateURLRegExp(path);
      const matches = url.match(generatedURLRegExp);

      if (url !== '/' && generatedURLRegExp.test('/')) {
        return false;
      }

      if (generatedURLRegExp.test(url) && matches[0].includes(url)) {
        this.params = matches.groups;
        return true;
      }

      return false;
    });
  }

  /**
   * @description Génère la regexp de l'url
   * @param {String} path
   * @returns {RegExp}
   * @memberof Router
   */
  _generateURLRegExp(path) {
    const reg = /\{([^\s\/\:]+)\:?(?:\((.*?)\))?\}/g;
    return new RegExp(
      `${path.replace(reg, (...args) =>
        args[2] ? `(?<${args[1]}>${args[2]})` : `(?<${args[1]}>\\w+)`
      )}/?`
    );
  }

  /**
   * @description Redirige vers la route demandée
   * @param {*} [route=this.routes]
   * @memberof Router
   */
  redirect(route = this.routes) {
    if (typeof route === 'string') {
      const redirectRoute = this._match(route, this.routes);
      if (!redirectRoute) throw `404 not found : ${window.location.pathname}`;
      history.replaceState({ key: route }, '', route);
      this.container.innerHTML = redirectRoute.controller();
      return;
    }
    const redirect = route.find(({ path }) => path.includes('*'));
    if (!redirect) throw `404 not found : ${window.location.pathname}`;
    if (redirect.hasOwnProperty('redirect')) {
      const redirectRoute = route.find(({ path }) =>
        path.includes(redirect.redirect)
      );
      if (!redirectRoute) throw `404 not found : ${window.location.pathname}`;
      history.replaceState({ key: redirectRoute.path }, '', redirectRoute.path);
      this.container.innerHTML = redirectRoute.controller();
      return;
    }
    if (redirect.hasOwnProperty('controller')) {
      this.container.innerHTML = redirect.controller();
    }
  }

  /**
   * @description Action au clique sur un lien ayant l'attribut 'data-router-link'
   * @param {Event} e
   * @memberof Router
   */
  _triggerRouterLink(e) {
    if (e.target.getAttribute('data-router-link') !== null) {
      e.preventDefault();
      const url = e.target.getAttribute('href');
      history.pushState({ key: url }, '', url);
      this._render();
    }
  }
}

let router = new Router('#app', [
  {
    path: '/',
    controller: function() {
      return `<h1>Home</h1>
      <a href="/profils" data-router-link>Aller à la liste de profils</a>`;
    }
  },
  {
    path: '/profils',
    controller() {
      return `<h1>Liste de profils</h1>
      <ul>
        <li>
          <a href="/profil/theo" data-router-link>Theo</a>
        </li>
      </ul>
      <a href="/profils" data-router-link>Aller à la liste</a>`;
    }
  },
  {
    path: '/profil/{id}',
    controller() {
      return `<h1>${router.params.id}</h1>
      <a href="/" data-router-link>Aller à la home</a>`;
    }
  },
  {
    path: '/profil/{name:(\\w+)}/{id:(\\d+)}',
    controller() {
      return `<h1>${router.params.name} ${router.params.id}</h1>
      <a href="/" data-router-link>Aller à la home</a>`;
    }
  },
  {
    path: '\\*',
    controller() {
      return `<h1>404 not found</h1>
      <a href="/" data-router-link>Aller à la home</a>`;
    }
  }
]);
