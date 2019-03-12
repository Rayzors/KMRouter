class Router {
  /**
   * Creates an instance of Router.
   * @param {Node} container
   * @param {Array} routes
   * @memberof Router
   */
  constructor(container, routes) {
    this.container = document.querySelector(container);
    this.routes = routes;
    this.params = {};
    this._init();
  }

  _escape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Initialise les écouteurs d'evenement
   * @memberof Router
   */
  _init() {
    window.addEventListener('load', this._render.bind(this));
    window.addEventListener('popstate', this._render.bind(this));
    this.container.addEventListener(
      'click',
      this._triggerRouterLink.bind(this)
    );
  }

  /**
   * Vérifie si la route est bien formatée
   *
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
   * Récupère l'objet de la route courante
   * Rend la page courante
   * @memberof Router
   */
  _render() {
    this.routes.forEach((route) => {
      route.path = this._formatPath(route.path);
    });

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
   * Vérifie si l'url existe dans les routes
   * Retourne l'objet de la route correspondante
   * @param {String} url
   * @param {Array} routes
   * @returns {Object}
   * @memberof Router
   */
  _match(url, routes) {
    return routes.find(({ path }) => {
      const generatedURLRegExp = this._generateURLRegExp(path);
      let matches = url.match(generatedURLRegExp);

      if (url !== '/' && generatedURLRegExp.test('/')) {
        return false;
      }

      if (generatedURLRegExp.test(url) && matches[0].includes(url)) {
        this.params = this._getParams(path, matches);
        return true;
      }

      return false;
    });
  }

  /**
   * Génère la regexp de l'url
   *
   * @param {String} path
   * @returns {RegExp}
   * @memberof Router
   */
  _generateURLRegExp(path) {
    let reg = path.replace(/\{([^\s\/\:]+)\:?(.*?)?\}/g, (...args) => {
      let reg = args[2];
      if (reg) this._escape(reg);
      return reg || '([^s/:]+)';
    });

    return new RegExp(reg + '/?');
  }

  /**
   * Récupère les paramètres de l'url
   *
   * @param {String} path
   * @param {Array} matches
   * @returns
   * @memberof Router
   */
  _getParams(path, matches) {
    let array;
    let obj = {};
    let i = 0;
    const reg = /\{([^\s\/\:]+)\:?(.*?)?\}/g;
    matches.shift();
    while ((array = reg.exec(path)) !== null) {
      obj[array[1]] = matches[i];
      i++;
    }
    return obj;
  }

  /**
   * Redirige vers la route demandée
   *
   * @param {*} [route=this.routes]
   * @returns
   * @memberof Router
   */
  redirect(route = this.routes) {
    if (typeof route === 'string') {
      let redirectRoute = this.route.find(({ path }) => path.includes(route));
      if (!redirect) throw `404 not found : ${window.location.pathname}`;
      history.replaceState({ key: redirectRoute }, '', redirectRoute);
      this.container.innerHTML = redirectRoute.controller();
      return;
    }
    let redirect = route.find(({ path }) => path.includes('*'));
    if (!redirect) throw `404 not found : ${window.location.pathname}`;
    let redirectRoute = route.find(({ path }) =>
      path.includes(redirect.redirect)
    );
    history.replaceState({ key: redirectRoute.path }, '', redirectRoute.path);
    this.container.innerHTML = redirectRoute.controller();
  }

  /**
   * Action au clique sur un lien ayant l'attribut 'data-router-link'
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
    path: '',
    controller: function() {
      return `<h1>Home</h1>
      <a href="/profils" data-router-link>Aller à la liste de profils</a>`;
    }
  },
  {
    path: 'profils',
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
    path: '/notfound',
    controller() {
      return `<h1>404 not found</h1>
      <a href="/" data-router-link>Aller à la home</a>`;
    }
  },

  {
    path: '\\*',
    redirect: '/notfound'
  }
]);
