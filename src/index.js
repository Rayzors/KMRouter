export class KMRouter {
  /**
   * @description Creates an instance of Router.
   * @param {string|Node} container
   * @param {Object[]} routes
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
    window.addEventListener('load', () =>
      this._dispatch(window.location.pathname)
    );
    window.addEventListener('popstate', () =>
      this._dispatch(window.location.pathname)
    );
    this.container.addEventListener('click', (e) => this._triggerRouterLink(e));
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
    if (path.match(/^\//) === null && path.match(/^\*$/) === null) {
      return `/${path}`;
    }
    if (path.match(/^\*$/) !== null) {
      return `\\*`;
    }
    return path;
  }

  /**
   * @description Vérifie si le paramètre container est une string ou un object
   * @param {String|Node} container
   * @returns {Node}
   * @memberof Router
   */
  _checkContainerType(container) {
    if (typeof container === 'string') {
      return document.querySelector(container);
    } else if (container instanceof Node) {
      return container;
    } else {
      throw 'The first argument must be an element or a string selector';
    }
  }

  /**
   * @description Vérifie si le paramètre routes est un tableau d'objets
   * @param {Array} routes
   * @returns {Array}
   * @throws The second argument must be an array of object
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
   * @throws path is missing on route number {i}
   * @memberof Router
   */
  _checkPathExist() {
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
  _dispatch(url, isPushState = true, redirect = false) {
    if (!url || (typeof url !== 'string' || url.trim() === '')) {
      throw 'No url renseigned';
    }

    const match = this._match(url);

    if (match && match.hasOwnProperty('redirect')) {
      this._dispatch(match.redirect);
    } else if (match) {
      if (isPushState) {
        history.pushState({ key: url }, '', url);
      } else if (!isPushState && url.match(/^\*$/) === null) {
        history.replaceState({ key: url }, '', url);
      }

      const template = match.controller({
        redirect: (uri) => this._dispatch.call(this, uri, false, true),
        params: this.params,
        path: window.location.pathname
      });

      if (template && typeof template === 'string') {
        this.container.innerHTML = template;
        if (redirect) return template;
      } else {
        this._dispatch('*', false);
      }
    } else {
      this._dispatch('*', false);
    }
  }

  /**
   * @description Vérifie si l'url existe parmi les routes
   * @param {String} url
   * @param {Object[]} routes
   * @returns {Object} Retourne l'objet de la route correspondante
   * @memberof Router
   */
  _match(url) {
    return this.routes.find(({ path }) => {
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
   * @description Action au clique sur un lien ayant l'attribut 'data-router-link'
   * @param {Event} e
   * @memberof Router
   */
  _triggerRouterLink(e) {
    if (e.target.getAttribute('data-router-link') !== null) {
      e.preventDefault();
      const url = e.target.getAttribute('href');
      this._dispatch(url);
    }
  }
}
